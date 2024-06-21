import { Close, Dashboard, ExitToApp, Group, ManageAccounts, Menu, Message } from '@mui/icons-material'
import { Drawer } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useLocation } from 'react-router-dom'
import { adminLogout } from '../../redux/thunks/admin';

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <Dashboard />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccounts />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <Group />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <Message />,
  },
];


const SideBar = ({w='100%'}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <div className={`flex flex-col gap-12 p-12 w-[${w}]`}>
      <h3 className=' uppercase text-center font-semibold'>chat</h3>

      <div className='flex flex-col gap-4'>
        {adminTabs.map((tab) => (
         <Link key={tab.path} to={tab.path} className={`p-4 hover:text-gray-500 rounded-full ${location.pathname === tab.path ? 'bg-black text-white hover:text-white': ''}`}>
            <div className='flex gap-4 items-center'>
              {tab.icon}
              <p className='text-lg'>{tab.name}</p>
            </div>
         </Link>  ))}

         <Link onClick={logoutHandler} className={`p-4 hover:text-gray-500 rounded-full mt-8`}>
            <div className='flex gap-4 items-center'>
              <ExitToApp/>
              <p className='text-lg'>Logout</p>
            </div>
         </Link>
      </div>

    </div>
  )
}


const AdminLayout = ({children}) => {
  const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <div className='grid grid-cols-12 min-h-[100vh]'>
      <div className='block md:hidden fixed right-4 top-4'>
        <button className='flex justify-center' onClick={handleMobile}>
          {isMobile? <Close/> : <Menu/>}
        </button>
      </div>

      <div className='hidden md:block md:col-span-4 lg:col-span-3'>
        <SideBar />
      </div>

      <div className='col-span-12 md:col-span-8 lg:col-span-9 bg-gray-300'>
        {children}
      </div>

      <Drawer open={isMobile} onClose={handleClose}>
        <SideBar w={'50vw'}/>
      </Drawer>  
    </div>
  )
}

export default AdminLayout