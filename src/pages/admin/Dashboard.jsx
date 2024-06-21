import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { AdminPanelSettings, Group, Message, Notifications, Person } from '@mui/icons-material'
import moment from 'moment'
import { DoughnutChart, LineChart } from '../../components/specific/Charts'
import { useFetchData } from '6pp'
import { server } from '../../constants/config'
import { useErrors } from "../../hooks/hook";
import { Skeleton } from '@mui/material'

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/stats`,
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const AppBar = (
    <div className=' shadow-md p-4 rounded-lg my-8 bg-white'>
      <div className='flex gap-4 justify-center items-center'>
        <AdminPanelSettings style={{fontSize: '2rem'}}/>
        <input className='p-2 bg-gray-300 rounded-lg' placeholder='search...' type="text" />
        <button className='p-2 px-4 rounded-full bg-black text-white'>Search</button>
        <span className='grow'/>
        <p className='hidden md:block'>{moment().format('dddd, D MMMM YYYY')}</p>
        <Notifications/>
      </div>
    </div>
    )

  const Widgets = (
    <div className='flex flex-col gap-4 sm:flex sm:flex-row items-center justify-between my-8'>
      <Widget title='Users' value={stats?.usersCount} icon={<Person/>}/>
      <Widget title='Chats' value={stats?.totalChatsCount} icon={<Group/>}/>
      <Widget title='Messages' value={stats?.messagesCount} icon={<Message/>}/>
    </div>
  )
   
  return (
    <AdminLayout>
      {loading? (<Skeleton height={'100vh'}/>) 
      : (
        <main className='mx-2'>

        {AppBar}
        
        <div className='flex flex-col lg:flex lg:flex-row gap-8 flex-wrap justify-center items-center lg:items-stretch'>
          <div className='bg-white shadow-xl rounded-lg p-8 w-full max-w-[45rem]'>
            <h2 className='text-2xl mb-4'>Last Messages</h2>
            <LineChart value={stats?.messagesChart || []}/>
          </div>
          
          <div className='bg-white shadow-xl rounded-lg p-8 w-full sm:w-[50%] max-w-[25rem] flex justify-center items-center relative'>
            <DoughnutChart labels={['Single Chats', 'Group Chats']} value={[ stats?.totalChatsCount - stats?.groupsCount || 0, stats?.groupsCount || 0,]}/>
            <div className='flex gap-2 justify-center items-center h-full w-full absolute'>
              <Group/>
              <p>Vs</p>
              <Person/>
            </div>
          </div>

        </div>

        {Widgets}
        </main>
      )}
    </AdminLayout>
  )
}

const Widget =({title, value, icon}) => {
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 my-4 w-[20rem]'>
      <div className='flex flex-col gap-4 items-center'>
        <h6 className='text-gray-900 rounded-[50%] border-4 border-gray-900 w-[5rem] h-[5rem] flex justify-center items-center'>
          {value}
        </h6>
        <div className='flex gap-4 items-center'>
          {icon}
          <h5>{title}</h5>
        </div>
      </div>
    </div>
  )
}


export default Dashboard