import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className='bg-gradient-to-b from-white to-gray-50 py-8 w-full rounded-2xl mt-48 py-4'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-8 mt-[3rem] mb-[3rem] text-sm'>
        {/* Logo and Description Section */}
        <div className='flex flex-col overflow-hidden'>
            <a href="/" className='w-fit overflow-hidden'>
              <img 
                src="https://res.cloudinary.com/dgia0ww1z/image/upload/v1744657344/pc6yvs6rzxgjc6dqnglg.png" 
                className='mb-3 w-[12rem] max-w-full' 
                alt="Logo" 
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(180deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)';
                }}
              />
            </a>
            <p className='max-w-full text-gray-600 leading-relaxed'>
  Crazy Dukaan – Dukaan in your Hand. Bringing you stylish and comfortable products that reflect top-tier trends. While we’re just starting out, our collection offers great value for the quality you receive — crafted to look and feel premium.
</p>
            
            {/* Social Media Icons */}
            <div className='flex gap-4 mt-6'>
              <a href="https://instagram.com/crazydukaan.store" target="_blank" rel="noopener noreferrer" className='social-icon'>
                <svg className="w-6 h-6 text-pink-600 hover:text-pink-700 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              
              <a href="https://wa.me/+918318042859" target="_blank" rel="noopener noreferrer" className="social-icon">
                <svg className="w-6 h-6 text-green-600 hover:text-green-700 transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
        </div>

        {/* Rest of the code remains the same */}
        {/* Quick Links Section */}
        <div>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Quick Links</h3>
            <ul className='flex flex-col gap-3 text-gray-600'>
                <li>
                  <a href="/" className='hover:text-orange-500 transition-colors duration-200 cursor-pointer'>Home</a>
                </li>
                <li>
                  <a href="/about" className='hover:text-orange-500 transition-colors duration-200 cursor-pointer'>About us</a>
                </li>
                <li>
                  <a className='hover:text-orange-500 transition-colors duration-200 cursor-pointer' onClick={() => navigate("/termsconditions")}>Privacy policy</a>
                </li>
            </ul>
        </div>

        {/* Contact Section */}
        <div>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>GET IN TOUCH</h3>
            <ul className='flex flex-col gap-3 text-gray-600'>
                <li className='flex items-center gap-2 hover:text-orange-500 transition-colors duration-200'>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="break-all">support@crazydukaan.com</span>
                </li>
            </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className='max-w-6xl mx-auto px-4'>
          <hr className='border-gray-200' />
          <p className='py-3 text-sm text-center text-gray-500'>Copyright © {new Date().getFullYear()} CrazyDukaan.store - All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer;
