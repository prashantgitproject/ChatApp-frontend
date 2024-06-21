import { Add, Remove } from '@mui/icons-material';
import React, { memo } from 'react'
import { transformImage } from '../../libs/features';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';

const UserItem = ({user, handler, handlerIsLoading, isAdded=false}, group) => {

  const me = useSelector((state) => state.auth);
  const myId = me.user._id;

    const {name, _id, avatar} = user;

    const clash = myId === _id;
    console.log(clash)

  return (
    <div>
        <div className={`flex text-white bg-[#132130] gap-1 items-center w-full mt-2 ${group? 'shadow-lg px-4 py-2 rounded-lg' : ''} ${clash? 'hidden': ''}`}>
            <Avatar src={transformImage(avatar)}/>
            <h6 className='text-lg w-full'>{name}</h6>
            <button className={`${handlerIsLoading? 'hidden': ''} text-white ${isAdded? 'bg-red-700': 'bg-blue-500'} p-[1px] rounded-full flex items-center`}
            onClick={() => handler(_id)}>
              {
                isAdded? <Remove/>: <Add/>
              }
                
            </button>
        </div>
    </div>
  )
}

export default memo(UserItem)