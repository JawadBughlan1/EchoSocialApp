import React from "react";

const SideLow = () => {
  return (
    <div className=" ">
      <h1 className="text-2xl font-bold mb-6">Echo</h1>
      <div className="space-y-4">
        <div className="hover:bg-slate-600 p-2 rounded">Home</div>
        <div className="hover:bg-slate-600 p-2 rounded">Search</div>
        <div className="hover:bg-slate-600 p-2 rounded">Explore</div>
        <div className="hover:bg-slate-600 p-2 rounded">Reels</div>
        <div className="hover:bg-slate-600 p-2 rounded">Messages</div>
        <div className="hover:bg-slate-600 p-2 rounded">Notifications</div>
        <div className="hover:bg-slate-600 p-2 rounded">Create</div>
        <div className="hover:bg-slate-600 p-2 rounded">Profile Picture</div>
        <div className="hover:bg-slate-600 p-2 rounded">More</div>
      </div>
    </div>
  );
};

export default SideLow;