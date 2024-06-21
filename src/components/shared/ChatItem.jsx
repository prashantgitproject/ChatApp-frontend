import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import AvatarCard from './AvatarCard';
import {motion} from 'framer-motion'

const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat,
}) => {
  return (
    <Link className='p-0 hover:bg-gray-700' to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
        <motion.div initial={{ opacity: 0, y: "-100%" }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className={`relative flex gap-4 items-center p-[1rem] ${sameSender? 'bg-black' : ''} ${sameSender? 'text-white':'text-black'}`} >
           
           <AvatarCard avatar={avatar}/> 
            
            <div className='flex flex-col gap-1'>
              <h6 className='text-lg text-white'>{name}</h6>  
              {
                newMessageAlert && (
                  <span className='text-white'>{newMessageAlert.count} New Message</span>
                )
              }
            </div>
            {
              isOnline && (
                <div className='w-3 h-3 rounded-lg bg-green-500 absolute top-[50%] right-4 -translate-y-[50%]'/>
              )
            }
        </motion.div>
    </Link>
  )
}

export default memo(ChatItem);