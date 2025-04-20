import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShipmentFee from './pages/ShipmentFee'
import Dashboard from './pages/Dashboard'
// import PlatfromFee from './pages/PlatformFee'
import CarauselSlider from './pages/Carausel'
import Users from './pages/Users'
import GlobalCoupons from './pages/GlobalCoupons';
export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹ '

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('token', token)
    if (token && window.location.pathname === '/') {
      navigate('/Dashboard')
    }

    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [token, navigate])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen pt-[5rem] sm:pt-[2rem]'>
    <ToastContainer />
    {token === ""
      ? <Login setToken={setToken} />
      : <>
          <Navbar 
            setToken={setToken} 
            toggleSidebar={toggleSidebar} 
            sidebarOpen={sidebarOpen}
          />
          <div className='flex'>
            <Sidebar 
              isOpen={sidebarOpen}
              closeSidebar={closeSidebar}
            />
            
            {/* Main content area */}
            <div className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0 lg:ml-16'
            }  pt-[5px] p-4 sm:pt-[10px] md:pt-7 lg:pt-[57px]`}>
              <div className='bg-white rounded-lg shadow-sm p-4 md:p-6'>
                  <Routes>
                    <Route path='/Dashboard' element={<Dashboard token={token} />} />
                    <Route path='/add' element={<Add token={token} />} />
                    <Route path='/list' element={<List token={token} />} />
                    <Route path='/orders' element={<Orders token={token} />} />
                    <Route path='/ShipmentFee' element={<ShipmentFee token={token} />} />
                    {/* <Route path='/PlatformFee' element={<PlatfromFee token={token} />} /> */}
                    <Route path='/Carausel' element={<CarauselSlider token={token} />} />
                    <Route path='/Users' element={<Users token={token} />} />
                    <Route path="/global-coupons" element={<GlobalCoupons token={token} />} />
                    <Route path='/' element={<Dashboard token={token} />} />
                  </Routes>
                </div>
              </div>
            </div>
          </>
      }
    </div>
  )
}

export default App
