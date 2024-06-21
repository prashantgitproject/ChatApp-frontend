import { Dialog } from '@mui/material'
import React from 'react'

const ConfirmLogoutDialog = ({open, handleClose, logoutHandler}) => {
  return (
    <Dialog className='' open={open} onClose={handleClose}>
        <div className='p-4 bg-[#39516b] text-white'>
            <h5 className='text-center'>Confirm Logout</h5>
            <p className='text-sm text-gray-300 mt-2'>Are you sure you want to logout?</p>
            <div className='flex gap-8 justify-end mt-4'>
                <button onClick={handleClose} className='text-blue-300'>No</button>
                <button onClick={logoutHandler} className='text-red-300'>Logout</button>
            </div>
        </div>
    </Dialog>
  )
}

export default ConfirmLogoutDialog