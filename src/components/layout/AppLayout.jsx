import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import ChatList from '../specific/ChatList'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { Drawer, Skeleton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc'
import { useErrors, useSocketEvents } from '../../hooks/hook'
import { getSocket } from '../../socket'
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events'
import { getOrSaveFromStorage } from '../../libs/features'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'
import Loader from '../shared/Loader'

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const params = useParams();
    const dispatch = useDispatch();
    const socket = getSocket()
    const navigate = useNavigate();
    
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);



    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

  return (
      <div className='h-[100vh] max-h-[100vh]'>
        <Title/>
        <div className='h-[4rem] bg-[#001019]'>
          <Header/>
        </div>

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {isLoading ? (
          <Loader />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <div className=' bg-[#001019] h-full'>
              <div className='w-[70vw] bg-[#232d36] h-full rounded-lg'>
                <div className='flex items-center p-4 border-b cursor-pointer' onClick={() => navigate('/')}>
                <img className='h-[4rem] w-[4rem]' src="/babble.png" alt="logo" />
                <h1 className='text-center font-semibold text-cyan-500 text-xl p-2'>Babble</h1>
                </div>
                <ChatList
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </div>
            </div>
          </Drawer>
        )}

        <section className=' grid grid-cols-12 bg-[#001019] h-[calc(100vh-4rem)]'>
            <div className='hidden sm:block sm:col-span-4 md:col-span-3 p-4 ' style={{height: '100%'}}>
              {isLoading? (<Loader/>) : 
                (<ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers}/>)
              }
            </div>
            <div className='col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6 h-[calc(100vh-4rem)]'>
                <WrappedComponent {...props} chatId={chatId} user={user}/>
            </div>
            <div className='hidden md:block text-white md:col-span-4 lg:col-span-3 p-4 ' style={{height: '100%'}}>
              <Profile user={user}/>
            </div>
        </section>
      </div>
    )
  }
}

export default AppLayout