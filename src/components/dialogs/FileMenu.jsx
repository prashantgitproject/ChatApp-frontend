import { Menu } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import { AudioFile, Image, UploadFile, VideoFile } from '@mui/icons-material';
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({anchorE1, chatId}) => {

  const { isFileMenu } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();

      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);

      if (res.data) toast.success(`${key} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${key}`, { id: toastId });

      // Fetching Here
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  

  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeFileMenu}>
        <div className='w-[10rem] bg-gray-600 my-[-1rem] py-[1rem]'>
          <div  className='flex flex-col gap-4 justify-start items-start w-full text-white'>

            <div onClick={selectImage} className='flex gap-2  cursor-pointer w-full p-2'>
              <abbr title="image"><Image/></abbr>
              <p className='ml-2'>Image</p>
              <input style={{ display: "none" }} type='file' multiple accept="image/png, image/jpeg, image/gif" onChange={(e) => fileChangeHandler(e, "Images")} ref={imageRef}/>
            </div>

            <div onClick={selectAudio} className='flex gap-2 cursor-pointer w-full p-2'>
              <abbr title="Audio"><AudioFile/></abbr>
              <p className='ml-2'>Audios</p>
              <input style={{ display: "none" }} type='file' multiple accept="audio/mpeg, audio/wav" onChange={(e) => fileChangeHandler(e, "Audios")} ref={audioRef}/>
            </div>

            <div onClick={selectVideo} className='flex gap-2 cursor-pointer w-full p-2'>
              <abbr title="Video"><VideoFile/></abbr>
              <p className='ml-2'>Videos</p>
              <input style={{ display: "none" }} type='file' multiple accept="video/mp4, video/webm, video/ogg" onChange={(e) => fileChangeHandler(e, "Videos")} ref={videoRef}/>
            </div>

            <div onClick={selectFile} className='flex gap-2 cursor-pointer w-full p-2'>
              <abbr title="File"><UploadFile/></abbr>
              <p className='ml-2'>File</p>
              <input style={{ display: "none" }} type='file' multiple accept="*" onChange={(e) => fileChangeHandler(e, "Files")} ref={fileRef}/>
            </div>

          </div>
        </div>
    </Menu>
  )
}

export default FileMenu