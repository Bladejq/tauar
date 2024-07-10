import React from 'react'
import Header from '../../components/admin_panel/Header'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className='h-screen w-full flex flex-col justify-between'>
        <Header/>
        <Outlet />
    </div>
  )
}

export default Layout