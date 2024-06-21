import { Dialog } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open, handleClose, deleteHandler}) => {
  return (
    <Dialog className='' open={open} onClose={handleClose}>
        <div className='p-4 bg-[#39516b] text-white'>
            <h5 className='text-center'>Confirm Delete</h5>
            <p className='text-sm text-gray-300 mt-2'>Are you sure you want ot delete this group?</p>
            <div className='flex gap-8 justify-end mt-4'>
                <button onClick={handleClose} className='text-blue-300'>No</button>
                <button onClick={deleteHandler} className='text-red-300'>Yes</button>
            </div>
        </div>
    </Dialog>
  )
}

export default ConfirmDeleteDialog