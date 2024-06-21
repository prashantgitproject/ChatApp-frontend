import { AlternateEmail, CalendarMonth, Face } from '@mui/icons-material'
import moment from 'moment'
import React from 'react'
import { transformImage } from '../../libs/features'
import { Avatar } from '@mui/material'

const Profile = ({user}) => {
  return (
    <div className='flex flex-col gap-8 items-center bg-[#232d36] rounded-lg p-2 h-full'>
      <Avatar src={transformImage(user?.avatar?.url)} sx={{ width: 180, height: 180, objectFit: "contain", marginBottom: "1rem", border: "5px solid white",}}/>
      <ProfileCard heading={'Bio'} text={user?.bio}/>
      <ProfileCard heading={'UserName'} text={user?.username} icon={<AlternateEmail/>}/>
      <ProfileCard heading={'Name'} text={user?.name} icon={<Face/>}/>
      <ProfileCard heading={'Joined'} text={moment(user?.createdAt).fromNow()} icon={<CalendarMonth/>}/>
    </div>
  )
}

const ProfileCard = ({text, icon, heading}) => (
  <div className='flex items-center text-white text-center gap-4 '>
    {icon && icon}
    <div className='flex flex-col gap-1'>
      <p className='text-lg'>{text}</p>
      <p className='text-sm text-gray-500'>{heading}</p>
    </div>
  </div>
)
  


export default Profile