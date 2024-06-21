import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { AttachFile, Send } from '@mui/icons-material';
import FileMenu from '../components/dialogs/FileMenu';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../socket';
import {ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING} from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { Skeleton } from '@mui/material';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScrollTop } from '6pp';
import { setIsFileMenu } from '../redux/reducers/misc';
import { useDispatch } from 'react-redux';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';

const Chat = ({chatId, user}) => {

  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);


  const chatDetails = useChatDetailsQuery({chatId, skip: !chatId});

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];


  const members = chatDetails?.data?.chat?.members;


  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };





  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if(!message.trim()) return;
    // Emitting message to server
    socket.emit(NEW_MESSAGE, {chatId, members, message});
    setMessage('');
  }




  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);







  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );



  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);

  
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (<Skeleton/>) : (
    <>
     <div className='flex flex-col gap-4 p-4 overflow-x-hidden overflow-y-scroll h-[90%] bg-[#001019]' ref={containerRef}>
        {
          allMessages.map((i, index) => (
            <MessageComponent key={i._id} message={i} user={user}/>
          ))
        }

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />

      </div>
      <form className='h-[10%]' onSubmit={submitHandler}>
        <div className='flex gap-1 h-[100%] items-center p-4 relative'>
          <button onClick={handleFileOpen} className='absolute left-5 rotate-[30deg] text-white'><AttachFile/></button>
          <input value={message} onChange={messageOnChange} placeholder='Type message here...' className='w-full h-[100%] border-none outline-none py-[1.5rem] px-12 rounded-lg bg-[#27333f] text-white' type="text" />
          <button className='bg-gray-800 p-2 text-cyan-500 hover:bg-black rounded-full flex items-center justify-center -rotate-[30deg]' type='submit'><Send/></button>
        </div>
      </form> 

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat);
