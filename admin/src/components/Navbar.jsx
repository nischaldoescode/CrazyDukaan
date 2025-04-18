import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken, toggleSidebar, sidebarOpen}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between bg-white shadow-sm fixed top-0 left-0 right-0 z-40'>
      <div className='flex items-center gap-4'>
        <button 
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors ${
            sidebarOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          <img 
            src={sidebarOpen ? assets.close_icon : assets.menu_icon} 
            alt="menu" 
            className='w-5 h-5'
          />
        </button>
        <img className='w-[max(20%,80px)]' src={assets.logo} alt="" />
      </div>
      <button 
        onClick={() => setToken('')} 
        className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-gray-700 transition-colors'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar