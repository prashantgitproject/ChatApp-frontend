import { useInputValidation } from '6pp'
import { SearchOff, SearchRounded } from '@mui/icons-material';
import { Dialog } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserItem from '../shared/UserItem';
import { SampleUsers } from '../../constants/SampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { useAsyncMutation } from "../../hooks/hook";


const Search = () => {

  const {isSearch} = useSelector(state => state.misc);
  // const { user } = useSelector((state) => state.auth);
  // console.log(user._id)
  // const ID = user._id;
  const dispatch = useDispatch();

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const [users, setUsers] = useState([])

  const search = useInputValidation('');

  // let isLoadingSendFriendRequest = false;

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);
 

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} sx={{height: {xs:'85%', sm: '100%'}}} >
      <div className='flex flex-col gap-4 p-8 md:w-[25rem] text-white bg-[#253546] justify-center items-center'>
        <h5 className='text-center text-xl'>Find People</h5>
        <div className='relative flex items-center'>
            <SearchRounded className='absolute left-3 bottom-[7px]'/>
          <input className='p-2 rounded-lg border-none bg-[#526279] pl-10 grow outline-none'
          placeholder='search username' type="text" value={search.value} onChange={search.changeHandler}/>
        </div>

        <div>
          {users.map(user => (
            <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest}/>
          ))}
        </div>

      </div>
    </Dialog>
  )
}

export default Search