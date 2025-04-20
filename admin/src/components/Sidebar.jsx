import React from "react"
import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import { FaTicketAlt } from 'react-icons/fa';
import { FaUsers } from "react-icons/fa";

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Mobile overlay - only shows on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - behaves differently on mobile vs desktop */}
      <div className={`
        fixed lg:fixed top-0 left-0 z-30 h-screen bg-white transition-all duration-300
        ${isOpen ? 'w-64' : 'w-0 lg:w-16'}
        border-r border-gray-200
      `}>
        <div className={`flex flex-col h-full pt-[110px] overflow-y-auto ${
          isOpen ? 'px-4 py-2' : 'px-2 py-2'
        }`}>
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="Dashboard"
            onClick={closeSidebar}
          >
            <img className="w-8 h-8 min-w-[20px]" src={assets.dashboard} alt="" />
            {isOpen && <span className="whitespace-nowrap">Dashboard</span>}
          </NavLink>
          
          {/* Other NavLinks remain the same */}
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="/add"
            onClick={closeSidebar}
          >
            <img className="w-8 h-8 min-w-[20px]" src={assets.add_icon} alt="" />
            {isOpen && <span className="whitespace-nowrap">Add Items</span>}
          </NavLink>

          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="/list"
            onClick={closeSidebar}
          >
            <img className="w-8 h-8 min-w-[20px]" src={assets.order_icon} alt="" />
            {isOpen && <span className="whitespace-nowrap">List Items</span>}
          </NavLink>

          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="/orders"
            onClick={closeSidebar}
          >
            <img className="w-8 h-8 min-w-[20px]" src={assets.order_icon} alt="" />
            {isOpen && <span className="whitespace-nowrap">Orders</span>}
          </NavLink>
          
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="/ShipmentFee"
            onClick={closeSidebar}
          >
            <img className="w-8 h-8 min-w-[20px]" src={assets.shipment_icon} alt="" />
            {isOpen && <span className="whitespace-nowrap">Shipment Fee</span>}
          </NavLink>
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }to="/global-coupons"
            onClick={closeSidebar}
            >
             <FaTicketAlt className="w-8 h-8 min-w-[20px]" />
             {isOpen && <span className="whitespace-nowrap">Global Coupons</span>}
            </NavLink>
          
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="/Carausel"
            onClick={closeSidebar}
          >
            <img className="w-8 h-8 min-w-[20px]" src={assets.carousel} alt="" />
            {isOpen && <span className="whitespace-nowrap">Carousel</span>}
          </NavLink>
          <NavLink
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
            to="/Users"
            onClick={closeSidebar}
          >
            <FaUsers className="w-8 h-8 min-w-[20px]" />
            {isOpen && <span className="whitespace-nowrap">Users</span>}
          </NavLink>
        </div>
      </div>
    </>
  )
}

export default Sidebar
