import { Dialog, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { setIsAddMember } from '../../redux/reducers/misc'

const AddMemberDialog = ({chatId}) => {
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };
  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <div className='flex flex-col gap-1 p-8 w-[20rem] bg-[#39516b] text-white'>
            <h5 className='text-center'>Add member</h5>
            <div className='flex flex-col gap-4'>
              {isLoading ? (<Skeleton/>) : data?.friends?.length > 0 ? (data?.friends?.map((i) => (
              <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>)))
              : (<p className='text-center p-4'>No Friends</p>)}
            </div>
            <div className='flex gap-8 justify-evenly items-center mt-4'>
                <button onClick={closeHandler} className='text-red-400'>Cancel</button>
                <button onClick={addMemberSubmitHandler} disabled={isLoadingAddMembers} className='p-2 bg-cyan-500 text-white rounded-md'>Submit changes</button>
            </div>
        </div>
    </Dialog>
  )
}

export default AddMemberDialog