import { DataGrid } from '@mui/x-data-grid'
import React from 'react'

const Table = ({rows, columns, heading, rowHeight = 52}) => {
  return (
    <section className='h-[100vh]'>
        <div className='shadow-lg rounded-lg p-4 py-4 px-12 m-auto w-full h-full overflow-hidden'>
            <h4 className='m-8 text-center uppercase'>{heading}</h4>
            <DataGrid style={{height: '80%'}} sx={{border: 'none', ".table-header": {bgcolor: 'black', color: 'white'}, bgcolor: "white"}} rows={rows} columns={columns} rowHeight={rowHeight}/>
        </div>
    </section>
  )
}

export default Table