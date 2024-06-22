import React from 'react'
import ChatItem from '../shared/ChatItem'

const ChatList = ({
    w = '100%',
    chats = [],
    chatId,
    onlineUsers = [],
    newMessagesAlert = [
        {
            chatId: '',
            count: 0,
        }
    ],
    handleDeleteChat,
}) => {
  return (
    <div className={`flex flex-col gap-1 w-[${w}] overflow-y-auto h-[100%] bg-[#232d36] rounded-lg md:p-0`}>
        {chats?.map((data, index) => {
            const {avatar, _id, name, groupChat, members} = data;

            const newMessageAlert = newMessagesAlert.find(({chatId}) => chatId === _id);

            const isOnline = members?.some((member) => onlineUsers.includes(member));

            return <ChatItem index={index} newMessageAlert={newMessageAlert} _id={_id} key={_id} isOnline={isOnline} avatar={avatar} name={name} groupChat={groupChat} sameSender={chatId === _id} handleDeleteChat={handleDeleteChat}/>;  
        }
        )}
    </div>
  )
}

export default ChatList