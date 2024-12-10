"use client"
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:4000"); 
interface MessageData { 
message:string, 
room: string
}
const App = () => {
  const [room, setRoom] = useState<string>("");
  const [message, sendMessage] = useState<string>("");
  const [msgReceived, setmsgReceived] = useState<string>("");
  const SettingRoom = ():void => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };
  const SendMessage = ():void => {
    socket.emit("send_message", { message, room });
  };
  useEffect(() => {
    socket.on(
      "receive_message",
      (data) => {
        setmsgReceived(data.message);
      }
    );
  }, [socket]);
  return (
    <div>
      <h1>Room id</h1>: {room}
      <input
        type="text"
        placeholder="enter in room with an id"
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <button onClick={SettingRoom}>Set room id</button>
      <h1>Recienve msg</h1>: {msgReceived}
      <input
        type="text"
        placeholder="Message .."
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
          sendMessage(e.target.value);
        }}
      />
      <button onClick={SendMessage}>Send</button>
    </div>
  );
};

export default App;
