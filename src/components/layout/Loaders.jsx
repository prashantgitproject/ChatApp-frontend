import { Skeleton, keyframes, styled } from '@mui/material'
import React from 'react'

 const LayoutLoader = () => {
  return (
    <div className='grid grid-cols-12 h-[calc(100vh-4rem)] gap-8 p-1'>
        <div className='hidden sm:block sm:col-span-4 md:col-span-3 '>
            <Skeleton variant='rectangular' height='100vh' />
        </div>
        <div className='h-100% col-span-12 sm:col-span-8 md:col-span-5 lg:col-span-6'>
            <div className='flex flex-col gap-2'>
                {Array.from({length: 10}).map((_, i) => (
                    <Skeleton key={i} variant='rounded' height={'5rem'}/>
                ))}
            </div>
        </div>
        <div className='hidden md:block md:col-span-4 lg:col-span-3'>
        <Skeleton variant='rectangular' height='100vh' />
        </div>
    </div>
  )
}

const bounceAnimation = keyframes`
0% { transform: scale(1); }
50% { transform: scale(1.5); }
100% { transform: scale(1); }
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bounceAnimation} 1s infinite`,
}));

const TypingLoader = () => {
    return (
        <div className='flex gap-2 p-2 justify-center'>
            <BouncingSkeleton variant='circular' width={40} height={40} style={{animationDelay: '0.1s'}}/>
            <BouncingSkeleton variant='circular' width={40} height={40} style={{animationDelay: '0.2s'}}/>
            <BouncingSkeleton variant='circular' width={40} height={40} style={{animationDelay: '0.4s'}}/>
            <BouncingSkeleton variant='circular' width={40} height={40} style={{animationDelay: '0.6s'}}/>
        </div>
    )
}

export { LayoutLoader, TypingLoader };
