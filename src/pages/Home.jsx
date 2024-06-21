import React from 'react'
import AppLayout from '../components/layout/AppLayout'

const Home = () => {
  return (
    <section className='h-[100%] bg-[#001019]'>
      <div className='text-center text-xl font-semibold pt-8 text-white'>Select a friend to Chat</div>
    </section>
  )
}

export default AppLayout()(Home);