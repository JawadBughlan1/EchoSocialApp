"use client" 
"use client"
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Peer } from 'peerjs';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
const socket = io("http://localhost:3000")

const VideoChat = () => { 
  const [peerId, setPeerId]= useState('')
  const [ remotePeerIdInput, setRemotePeerIdInput] = useState('')
  const [isCallActive, setIsCallActive]= useState(false)
    const [isMuted, setIsMuted]= useState(false) 
    const [isVideoOff, setIsVideoOff]= useState(false)
    
    const currentUserVideoRef = useRef<HTMLVideoElement>(null) 
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const peerInstance = useRef<Peer | null>(null)
    const currentStream = useRef<MediaStream | null>(null)  

    useEffect(()=>{ 
      const peer = new Peer();  
      peer.on('open', (id)=>{ 
        setPeerId(id); 
        socket.emit('join-room', id);
      }) 
      peer.on('call', async(call)=>{
         const stream = await navigator.mediaDevices.getUserMedia({ 
          video:true, 
          audio:true
         }) 
         currentStream.current = stream; 
         if(currentUserVideoRef.current){ 
          currentUserVideoRef.current.srcObject = stream;
         } 

         call.answer(stream); 
         call.on('stream', (remoteStream)=>{ 
          if (remoteVideoRef.current){ 
            remoteVideoRef.current.srcObject = remoteStream;
          }
          }) 
          setIsCallActive(true)
      } ) 
      peerInstance.current = peer;
      return () => {
        peer.destroy();
        socket?.disconnect();
        currentStream.current?.getTracks().forEach(track => track.stop());
      };
    }, []);
    const call = async (remotePeerId: string) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      currentStream.current = stream;
      if (currentUserVideoRef.current) {
        currentUserVideoRef.current.srcObject = stream;
      }
  
      const call = peerInstance.current?.call(remotePeerId, stream);
      call?.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });
      setIsCallActive(true);} 
      const endCall = () => {
        currentStream.current?.getTracks().forEach(track => track.stop());
        if (currentUserVideoRef.current) {
          currentUserVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        setIsCallActive(false);
      };
    
      const toggleMute = () => {
        if (currentStream.current) {
          const audioTracks = currentStream.current.getAudioTracks();
          audioTracks.forEach(track => {
            track.enabled = !track.enabled;
          });
          setIsMuted(!isMuted);
        }
      };
    
      const toggleVideo = () => {
        if (currentStream.current) {
          const videoTracks = currentStream.current.getVideoTracks();
          videoTracks.forEach(track => {
            track.enabled = !track.enabled;
          });
          setIsVideoOff(!isVideoOff);
        }
      };

      return (
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-2xl font-bold mb-4">Video Call App</h1>
              <p className="mb-2">Your ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{peerId}</span></p>
              
              {!isCallActive && (
                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={remotePeerIdInput}
                    onChange={e => setRemotePeerIdInput(e.target.value)}
                    placeholder="Enter Peer ID to call"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => call(remotePeerIdInput)}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    <Phone size={20} /> Call
                  </button>
                </div>
              )}
            </div>
    
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <video
                  ref={currentUserVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-4">
                  <p className="text-center font-semibold">Your Video</p>
                </div>
              </div>
    
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-4">
                  <p className="text-center font-semibold">Remote Video</p>
                </div>
              </div>
            </div>
    
            {isCallActive && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-8 py-4 flex gap-6">
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-4 rounded-full ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200`}
                >
                  {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
                <button
                  onClick={endCall}
                  className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <PhoneOff size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    

export default VideoChat