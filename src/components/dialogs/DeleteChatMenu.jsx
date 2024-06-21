import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { Delete,ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import { useDeleteChatMutation,useLeaveGroupMutation,} from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <div className="w-[10rem] p-2 cursor-pointer flex items-center gap-2"  onClick={isGroup ? leaveGroupHandler : deleteChatHandler}>
        {isGroup ? (
          <>
            <ExitToApp/>
            <p className="text-lg text-center p-1">Leave Group</p>
          </>
        ) : (
          <>
            <Delete/>
            <p className="text-lg text-center p-1">Delete Chat</p>
          </>
        )}
      </div>
    </Menu>
  );
};

export default DeleteChatMenu;