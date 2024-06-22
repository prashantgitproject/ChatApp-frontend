import React from 'react'

const Loader = () => {
  return (
    <div className={`fixed inset-0 h-[100vh] flex justify-center items-center bg-[#001019] z-10`}>
        <img className={`h-[15rem] w-[15rem]`} src={'/babble.gif'} alt="Logo" />
    </div>    
  )
}

export default Loader