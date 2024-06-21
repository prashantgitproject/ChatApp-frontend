import React from 'react'
import { transformImage } from '../../libs/features'
import { Avatar } from '@mui/material'

const AvatarCard = ({avatar = [], max = 4}) => {
  return (
    <div className='flex gap-4 p-0'>
        <div className=" relative">
            <div className='w-[7rem]  h-[3rem]'>
                {avatar.map((i, index) => (
                    <Avatar
                    key={Math.random() * 100}
                    src={transformImage(i)}
                    alt={`Avatar ${index}`}
                    sx={{
                      width: "3rem",
                      height: "3rem",
                      position: "absolute",
                      left: {
                        xs: `${0.5 + index}rem`,
                        sm: `${index}rem`,
                      },
                    }}
                  />
                ))}
            </div>
        </div>

    </div>
  )
}

export default AvatarCard