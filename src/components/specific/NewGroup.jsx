import { useInputValidation } from '6pp'
import { Dialog, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import UserItem from '../shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import toast from 'react-hot-toast'
import { setIsNewGroup } from '../../redux/reducers/misc'


const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    { isError,error, },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };


  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <div className='flex flex-col p-8 md:w-[25rem] gap-4 text-white bg-[#253546]'>
        <h5 className='text-center text-xl'>New Group</h5>
        <input className='p-2 border bg-[#526279] border-none rounded-lg outline-none' type="text" 
         value={groupName.value} onChange={groupName.changeHandler} placeholder='Group Name'/>
        <h6>Members</h6>

        <div className='flex flex-col gap-1 '>
          {isLoading? (<Skeleton/>) : (
            data?.friends?.map(i => (
              <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
            ))
          )}
        </div>

        <div className='flex gap-4 justify-evenly'>
          <button onClick={closeHandler} className='text-red-400'>Cancel</button>
          <button className='p-2 bg-cyan-600 text-white rounded-xl' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</button>
        </div>

      </div>
    </Dialog>
  )
}

export default NewGroup