import moment from 'moment';
import React, { memo } from 'react'
import { fileFormat } from '../../libs/features';
import RenderAttachment from './RenderAttachment';
import { motion } from "framer-motion";

const MessageComponent = ({message, user}) => {
    const {attachments=[], content, sender, createdAt} = message;
    const sameSender = sender?._id === user?._id;

    const timeAgo = moment(createdAt).fromNow();
  return (
    <motion.div initial={{ opacity: 0, x: "-100%" }} whileInView={{ opacity: 1, x: 0 }} className={`${sameSender? 'self-end bg-gradient-to-b from-violet-600 to-indigo-600': 'self-start bg-gradient-to-b from-slate-500 to-slate-800'} text-white rounded-lg p-2 w-fit`}>
        {!sameSender && <p className='text-xs text-cyan-400 font-semibold'>{sender?.name}</p>}
        {content && <p className='text-[0.9rem] text-white'>{content}</p>}

        {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <div key={index}>
              <a className='text-black' href={url} target="_blank" download >
                {RenderAttachment(file, url)}
              </a>
            </div>
          );
        })}

        <p className='text-gray-300 text-[10px]'>{timeAgo}</p>
    </motion.div>
  )
}

export default memo(MessageComponent)