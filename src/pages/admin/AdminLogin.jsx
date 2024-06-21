import { useInputValidation } from '6pp';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { adminLogin, getAdmin } from '../../redux/thunks/admin';

const AdminLogin = () => {

  const { isAdmin } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

    useEffect(() => {
      dispatch(getAdmin());
    }, [dispatch]);

    if (isAdmin) return <Navigate to="/admin/dashboard" />;
  return (
    <section className='flex justify-center items-center h-[100vh] bg-gray-700'>
      <div className='p-4 flex items-center justify-center flex-col gap-2 bg-gray-100 shadow-2xl rounded-lg max-w-xs w-full'>
        
          <div className='w-full text-center'>  
          <h4>Admin Login</h4>
          <form onSubmit={submitHandler} className='flex flex-col gap-2'>
            <input type="password" value={secretKey.value} onChange={secretKey.changeHandler} placeholder="Secret Key" className='p-2 border-2 rounded-md' />
            <button type="submit" className='p-2 bg-blue-500 text-white rounded-md'>Login</button>
          </form>
          </div>

      </div>
    </section>
  )
}

export default AdminLogin