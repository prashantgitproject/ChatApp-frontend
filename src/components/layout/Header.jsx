import { Add, Group, Logout, Menu, Notifications, Search } from '@mui/icons-material';
import { Backdrop, Badge, Tooltip } from '@mui/material';
import React, { Suspense, lazy, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { server } from '../../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from "../../redux/reducers/auth";
import toast from 'react-hot-toast';
import axios from 'axios';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';


const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
const ConfirmLogoutDialog = lazy(() => import('../dialogs/ConfirmLogoutDialog'));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [confirmLogoutDialog, setConfirmLogoutDialog] = useState(false);

  const {isSearch, isNotification, isNewGroup} = useSelector(state => state.misc);
  const {notificationCount} = useSelector(state => state.chat);


  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };
  const openSearch = () => {
    dispatch(setIsSearch(true))
  };
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  }
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => {
    navigate('/groups');
  };
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const openConfirmLogoutHandler = () => {
    setConfirmLogoutDialog(true);
  };

  const closeConfirmLogoutHandler = () => {
    setConfirmLogoutDialog(false);
  };


  return (
    <>
      <section className='h-[100%] static flex justify-center items-center p-1 '>
        <div className='static bg-[#232d36] grow h-full text-white rounded-lg px-2'>
          <div className='flex gap-1 items-center h-full'>
            <h6 className='hidden sm:block text-xl text-cyan-500 font-semibold'>YoChat</h6>
            <button className='block sm:hidden' onClick={handleMobile}><Menu/></button>
            <div className='flex-grow'/>
            <div className='flex gap-8'>
              <Tooltip title={'search'}><button onClick={openSearch}><Search/></button></Tooltip> 
              <Tooltip title={'New Group'}><button onClick={openNewGroup}><Add/></button></Tooltip> 
              <Tooltip title={'Manage Group'}><button onClick={navigateToGroup}><Group/></button></Tooltip> 
              <Tooltip title={'Notfications'}><button onClick={openNotification}>
                 <Badge badgeContent={notificationCount} color="error">
                  <Notifications/>
                  </Badge> </button>
              </Tooltip> 
              <Tooltip title={'Logout'}><button onClick={openConfirmLogoutHandler}><Logout/></button></Tooltip> 
            </div>
          </div>
        </div>
      </section>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog/>
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog/>
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog/>
        </Suspense>
      )}

      {confirmLogoutDialog && <Suspense fallback={<Backdrop open/>}>
        <ConfirmLogoutDialog open={openConfirmLogoutHandler} handleClose={closeConfirmLogoutHandler} logoutHandler={logoutHandler}/>
      </Suspense>}
    </>
  )
}

export default Header