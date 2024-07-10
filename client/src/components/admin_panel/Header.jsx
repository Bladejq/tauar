import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='w-full flex justify-between px-4 py-2 bg-red-500 items-center'>  
        <div className='flex items-center'>
            <Link to='/admin' className='text-white text-2xl font-bold'>Tauar <span>Admin</span></Link>
        </div>
        
        <div className='flex space-x-4'>
            <Link to='/admin' className='text-white text-2xl font-bold'>Тізім </Link>
            <Link to='/admin' className='text-white text-2xl font-bold'>Өнім қосу </Link>
            <Link to='/admin' className='text-white text-2xl font-bold'>Өңдеу</Link>
            <Link to='/admin' className='text-white text-2xl font-bold'>Тапсырыс</Link>
        </div>
    </header>
  )
}

export default Header
