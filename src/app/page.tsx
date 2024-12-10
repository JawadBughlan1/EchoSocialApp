import React from 'react'
import SideLow from '@/Components/SideLow/SideLow'
import Stories from '@/Components/Stories/Stories'
import VideoChat from '@/Components/Chat/VideoChat'


const page = () => {
  return (
    <div className='flex flex-row'>  
      <div className='flex flex-col w- h-screen p-4 bg-slate-100'> <SideLow  /> </div>
      <Stories/>  
      {/* <ChatApplication/> */}
      <VideoChat/>
    
    </div>
  )
}

export default page
