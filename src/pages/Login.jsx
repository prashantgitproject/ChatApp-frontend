import { useFileHandler, useInputValidation } from '6pp';
import { CameraAlt } from '@mui/icons-material';
import React, { useState } from 'react'
import { usernameValidator } from '../utils/validators';
import axios from 'axios';
import { server } from '../constants/config';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import { Avatar } from '@mui/material';

const Login = () => {

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const toggleLogin = () => setIsLogin((prev) => !prev);

  const dispatch = useDispatch();

  const name = useInputValidation('');
  const bio = useInputValidation('');
  const username = useInputValidation('', usernameValidator);
  const password = useInputValidation('');

  const avatar = useFileHandler('single');


  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <section className='flex justify-center items-center h-[100vh] bg-gray-900'>
      <div className='p-4 flex items-center justify-center flex-col gap-2 bg-gray-700 shadow-2xl rounded-lg max-w-xs w-full'>
        {isLogin ? (
          <div className='w-full text-center'>  
          <h4 className='text-white py-2 font-semibold'>Login</h4>
          <form onSubmit={handleLogin} className='flex flex-col gap-2'>
            <input type="text" placeholder="Username" value={username.value} onChange={username.changeHandler} className='p-2 border-2 rounded-md' />
            <input type="password" value={password.value} onChange={password.changeHandler} placeholder="Password" className='p-2 border-2 rounded-md' />
            <button disabled={isLoading} type="submit" className={`${isLoading? ' bg-blue-300':''} p-2 bg-blue-500 text-white rounded-md`}>Login</button>
            <span className='text-center text-white'>OR</span>
            <button disabled={isLoading} onClick={toggleLogin}
             type="button" className='text-center text-gray-400'>Sign Up instead</button>
          </form>
          </div>
          ) : (
          <div className='w-full text-center'>
          <h4 className='text-white py-2 font-semibold'>Sign Up</h4>
          <form onSubmit={handleSignUp} className='flex flex-col gap-2'>

            <div className='self-center relative h-[10rem] w-[10rem]'>
            <Avatar sx={{  width: "10rem", height: "10rem", objectFit: "contain",}} src={avatar.preview}/>
              <label type='button' className='rounded-full p-1 absolute bottom-0 right-0 text-white bg-slate-700 hover:bg-slate-900'>
                <CameraAlt/>
                <input type="file" id="file" className='absolute hidden' onChange={avatar.changeHandler}/>
              </label>
            </div>

            {avatar.error && <span className='text-red-400 text-sm text-center'>{avatar.error}</span>}

            <input type="text" value={name.value} onChange={name.changeHandler} placeholder="Name" className='p-2 border-2 rounded-md' />
            <input type="text" value={bio.value} onChange={bio.changeHandler} placeholder="Bio" className='p-2 border-2 rounded-md' />
            <input type="text" value={username.value} onChange={username.changeHandler} placeholder="Username" className='p-2 border-2 rounded-md' />
            
            {username.error && <span className='text-red-400 text-sm text-center'>{username.error}</span>}
            
            <input type="password" value={password.value} onChange={password.changeHandler} placeholder="Password" className='p-2 border-2 rounded-md' />
            <button disabled={isLoading} type="submit" className={`${isLoading? 'bg-blue-300' : ''} p-2 bg-blue-500 text-white rounded-md`}>Sign Up</button>
            <span className='text-center text-white'>OR</span>
            <button disabled={isLoading} onClick={toggleLogin}
             type="button" className='text-center text-gray-400'>Login instead</button>
          </form>
          </div>
        )}
      </div>
    </section>
  )
}

export default Login