import { Avatar, Dialog, Skeleton } from '@mui/material'
import React, { memo, useRef } from 'react'
import { transformImage } from '../../libs/features'
import { useDispatch, useSelector } from 'react-redux'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import { setIsNotification } from '../../redux/reducers/misc'

const Notifications = () => {

  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();
  const rejectRef = useRef(null)

  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  console.log(data);

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => {
    dispatch(setIsNotification(false))
    const button = rejectRef.current;
    if(button){
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
      });
      button.dispatchEvent(clickEvent);
    }
  };

  useErrors([{ error, isError }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <div className='flex flex-col p-4 sm:p-8 w-[25rem] bg-[#253546] text-white'>
      <h5 className='text-center text-xl'>Friend Requests</h5>
      { isLoading? (<Skeleton/>) : 
        ( <>
          { data?.allRequests.length > 0 ? (
              data?.allRequests.map(({sender, _id}) => (
                <NotificationItem key={_id} sender={sender} _id={_id} handler={friendRequestHandler} rejectRef={rejectRef}/>
              ))
            ): <h5 className='text-center text-lg'>0 Notifications</h5> }
          </> )
      }
      </div>
    </Dialog>
  )
}

const NotificationItem = memo(({sender, _id, handler, rejectRef}) => {
  const {name, avatar} = sender;
  return(
    <div className='text-white'>
        <div className='flex gap-4 items-center w-full mt-2'>
            <Avatar src={transformImage(avatar)} alt={name} sx={{ width: 40, height: 40 }}/>
            <h6 className='  w-full md:me-8'>
              {name}
            </h6>
            <div className='xs:flex xs:flex-col gap-8 sm:flex'>
              <button className='text-blue-400' onClick={() => handler({_id, accept:true})}>Accept</button>
              <button ref={rejectRef} className='text-red-300' onClick={() => handler({_id, accept:false})}>Reject</button>
            </div>
        </div>
    </div>
  )
})

export default Notifications