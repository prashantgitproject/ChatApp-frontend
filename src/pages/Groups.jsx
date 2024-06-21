import { Add, Delete, Done, Edit, KeyboardBackspace, Menu } from '@mui/icons-material'
import { Backdrop, CircularProgress, Drawer, Tooltip } from '@mui/material'
import React, { Suspense, lazy, memo, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AvatarCard from '../components/shared/AvatarCard'
import UserItem from '../components/shared/UserItem'
import { LayoutLoader } from '../components/layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { setIsAddMember } from '../redux/reducers/misc'

const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'));
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'));

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery( { chatId, populate: true }, { skip: !chatId });

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation( useRemoveGroupMemberMutation);

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation( useDeleteChatMutation);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      console.log(groupData);
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate('/');
  }

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  }

  const handleMobileClose = () => { setIsMobileMenuOpen(false); }

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    // if (chatId) {
    //   setGroupName(`Group Name ${chatId}`);
    //   setGroupNameUpdatedValue(`Group Name ${chatId}`);
    // }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);


  const IconBtns =(
    <>
    <button className='block sm:hidden fixed top-4 right-4'
     onClick={handleMobile}>
      <Menu/>
    </button>

    <Tooltip title='back'>
      <button className='absolute flex justify-center top-8 left-8 bg-gray-700 text white rounded-full p-1 hover:bg-gray-900 text-white'
       onClick={navigateBack}>
        <KeyboardBackspace/>
      </button>
    </Tooltip> 
    </>
  )

  const GroupName = <div className='flex gap-4 p-12 justify-center items-center'>
    {isEdit? (
      <>
        <input className='p-2 border-none outline-none bg-gray-700 text-white rounded-lg' type="text" value={groupNameUpdatedValue} onChange={e => setGroupNameUpdatedValue(e.target.value)} />
        <button className='' onClick={updateGroupName} disabled={isLoadingGroupName}><Done/></button>
      </>
    ): (
      <>
        <h4 className='text-center'>{groupName}</h4>
        <button onClick={()=>setIsEdit(true)} disabled={isLoadingGroupName}><Edit/></button>
      </>
    )}
  </div>



    const buttonGroup = (
      <div className='flex flex-col-reverse sm:flex sm:flex-row gap-4 sm:p-4 md:px-12 md:py-4'>
        <button onClick={openConfirmDeleteHandler} className='flex gap-1 text-red-500 p-2 border border-red-500 rounded-lg'><Delete/>Delete Group</button>
        <button onClick={openAddMemberHandler} className='flex gap-1 bg-cyan-500 text-white p-2 rounded-lg'><Add/>Add Member</button>
      </div>  
    )


  return myGroups.isLoading? (<LayoutLoader/>) : (
    <div className='grid grid-cols-12 h-[100vh]'>

      <div className=' hidden sm:block sm:col-span-4'>
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </div>

      <div className='col-span-12 sm:col-span-8 flex flex-col items-center relative py-4 px-12 bg-[#253546] text-white'>
        {IconBtns}
        {groupName && 
        <>
         {GroupName}

         <div className='self-start m-8'>Members</div>
         <div className='flex flex-col max-w-[45rem] w-[100%] sm:p-4 md:px-12 md:py-4 h-[50vh] overflow-auto gap-4'>
          {/* members */}

          {isLoadingRemoveMember ? (<CircularProgress />) : (
                members.map((user) => (<UserItem key={user._id} handler={removeMemberHandler} user={user} isAdded/>))
            )}
         </div>

          {buttonGroup}
        </>}
      </div>

          {isAddMember && <Suspense fallback={<Backdrop open/>}>
              <AddMemberDialog chatId={chatId}/>
            </Suspense>}

          {confirmDeleteDialog && <Suspense fallback={<Backdrop open/>}>
            <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/>
          </Suspense>}

      <Drawer className='block sm:hidden' open={isMobileMenuOpen} onClose={handleMobileClose}>
      <GroupsList className='w-[50vw]' myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Drawer>
    </div>
  )
}






const GroupsList = ({w='100%', myGroups=[], chatId}) => (
  <div className={`flex flex-col gap-1 w-[${w}] bg-[#132130] h-[100vh] overflow-y-scroll text-white`}>
    {
      myGroups.length > 0 ? myGroups.map((group) => <GroupListItem key={group._id} group={group} chatId={chatId}/>) :
      <p className='text-center p-4'>No Groups</p>
    }
  </div>
)

const GroupListItem = memo(({group, chatId}) => {

  const {name, avatar, _id} = group;

  return <Link className='text-white p-4 hover:bg-gray-700' onClick={(e) => {if (chatId === _id) e.preventDefault();}}
   to={`?group=${_id}`}>
    <div className='flex items-center gap-4'>
      <AvatarCard avatar={avatar}/>
      <p className='text-sm'>{name}</p>
    </div>
  </Link>
})

export default Groups