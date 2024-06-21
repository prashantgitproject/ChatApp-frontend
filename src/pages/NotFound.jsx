import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='h-[100vh] flex flex-col justify-center items-center'>
        <h1 className='font-semibold text-2xl'>404</h1>
        <h2>Not Found</h2>
        <Link className='text-purple-900' to='/'>Go back to home</Link>
    </div>
  )
}

export default NotFound