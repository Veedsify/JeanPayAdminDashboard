"use client";
import React from "react";

const UserCard = ({ name }: { name?: string }) => {
  const user = {
    name,
    avatarColor: "bg-[#005B58]",
  };

  return (
    <div className="bg-white p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">User</h3>
      </div>
      <div className="flex flex-col items-center text-center py-4">
        <div className={`w-20 h-20 rounded-full ${user.avatarColor}`} />
        <h2 className="text-lg font-bold mt-4 text-gray-800">{user.name}</h2>
      </div>
    </div>
  );
};

export default UserCard;
