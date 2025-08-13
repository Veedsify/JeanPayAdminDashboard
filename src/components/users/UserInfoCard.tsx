"use client";

import { Edit, MessageCircle, MoreHorizontal } from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// Define a type for the user object for better type safety
interface User {
  name: string;
  username: string;
  email: string;
  id: string;
  phone: string;
}

const UserInfoCard = ({ user }: { user?: User }) => {
  // If user data is not available, display a loading indicator or a placeholder.
  // This prevents runtime errors if the component is rendered without a user prop.
  if (!user) {
    return (
      <div className="bg-white p-6 rounded-2xl flex flex-col h-full items-center justify-center">
        <LoadingSpinner />
        <p className="mt-2 text-gray-500">Loading user data...</p>
      </div>
    );
  }

  // All user information is now sourced from the `user` prop,
  // making the component's data flow clear and predictable.
  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col h-full">
      <div className="flex flex-col items-center space-y-2">
        <div className={`w-24 h-24 rounded-full bg-gray-300`} />{" "}
        <h2 className="text-xl font-bold mt-4 text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.username}</p>
        <div className="flex space-x-3 mt-2">
          <button className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <MessageCircle size={18} className="text-gray-600" />
          </button>
          <button className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <Edit size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">User Info</h3>
          <MoreHorizontal className="text-gray-400 cursor-pointer" />
        </div>
        <div className="space-y-6 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">USER ID</span>
            <span className="font-medium text-gray-800">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">GENDER</span>
            <span className="font-medium text-gray-800">MALE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">EMAIL</span>
            <span className="font-medium text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">PHONE</span>
            <span className="font-medium text-gray-800">{user.phone}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button
          size="lg"
          className="w-full bg-background cursor-pointer text-green-700 font-semibold py-3 rounded-lg hover:bg-green-100 transition-colors"
        >
          Edit User Data
        </Button>
      </div>
    </div>
  );
};

export default UserInfoCard;
