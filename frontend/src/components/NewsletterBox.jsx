import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewsletterBox = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('userInformation');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    navigate('/login'); // Navigate to login when clicked
  };

  if (user) return null;

  return (
    <div className='text-center m-3'>
      <p className='text-2xl font-medium text-gray-800'>Register now for exclusive offers</p>
      <p className='text-gray-400 mt-4 text-center'>
        Join our community and get exclusive deals. 
      </p>
      <form onSubmit={onSubmitHandler} className='w-[80vw] sm:w-1/2 flex items-center gap-2 mx-auto my-6 border pl-2'>
        <input 
          className='w-full sm:flex-1 outline-none' 
          type="email" 
          placeholder='Enter your email' 
          required 
        />
        <button 
          type='submit' 
          className='bg-black text-white text-xs px-5 py-4 hover:bg-gray-800 transition-colors'
        >
          REGISTER
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;