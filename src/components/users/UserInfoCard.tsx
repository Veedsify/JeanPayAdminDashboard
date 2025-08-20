"use client";

import { Edit, MessageCircle, MoreHorizontal, SaveIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ToggleSwitch } from "../settings/ToggleSwitch";
import { EditFields, User } from "@/types/user";
import useAdminUsers from "@/data/hooks/AdminUsersHook";
import toast from "react-hot-toast";

const UserInfoCard = ({
  user,
  isLoading,
}: {
  user?: User | null;
  isLoading: boolean;
}) => {
  console.log("UserInfoCard user:", user);
  const { updateUserDetails } = useAdminUsers();
  const [editMode, setEditMode] = React.useState(false);
  const [data, setData] = React.useState<EditFields | null>(user || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (["is_blocked", "is_verified"].includes(name)) {
      setData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleToggle = (checked: boolean, name: string) => {
    setData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSave = () => {
    if (!data) return;
    if (
      data.name === user?.name &&
      data.username === user?.username &&
      data.email === user?.email &&
      data.phone === user?.phone &&
      data.is_blocked === user?.is_blocked &&
      data.is_verified === user?.is_verified
    ) {
      setEditMode(false);
      return;
    }

    updateUserDetails.mutate(
      { userId: user?.id || 0, data },
      {
        onSuccess: () => {
          setEditMode(false);
          toast.success("User details updated successfully");
        },
        onError: (error) => {
          console.error("Error updating user:", error);
          toast.error("Failed to update user details");
        },
      }
    );

    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl flex flex-col h-full items-center justify-center">
        <LoadingSpinner />
        <p className="mt-2 text-gray-500">Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-2xl flex flex-col h-full items-center justify-center">
        <p className="text-gray-500">No user data available</p>
      </div>
    );
  }

  const toggleEditButton = () => {
    setEditMode((prev) => !prev);
  };

  // All user information is now sourced from the `user` prop,
  // making the component's data flow clear and predictable.
  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col h-full">
      <div className="flex flex-col items-center space-y-2">
        <Image
          width={96}
          height={96}
          src={user.profile_image}
          alt={user.name}
          className={`w-24 h-24 rounded-full object-cover `}
        />{" "}
        <h2 className="text-xl font-bold mt-4 text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.username}</p>
        <div className="flex space-x-3 mt-2">
          <button className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
            <MessageCircle size={18} className="text-gray-600" />
          </button>
          <button
            onClick={toggleEditButton}
            className="p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
          >
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
        <motion.div layoutId="edit-button">
          <Button
            onClick={toggleEditButton}
            size="lg"
            className="w-full bg-green-50 cursor-pointer text-green-700 font-semibold py-3 rounded-lg hover:bg-green-100 transition-colors"
          >
            Edit User Data
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bg-black/50 top-0 left-0 w-full min-h-screen z-50 flex items-center justify-center p-4"
            onClick={toggleEditButton}
          >
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Edit User
              </h3>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  defaultValue={data?.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                  defaultValue={data?.username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  defaultValue={data?.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleInputChange}
                  defaultValue={data?.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="mt-3 flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Block User
                </label>
                <ToggleSwitch
                  enabled={data?.is_blocked || false}
                  onChange={(checked) => handleToggle(checked, "is_blocked")}
                />

                <label className="text-sm font-medium text-gray-700">
                  Verify User
                </label>
                <ToggleSwitch
                  enabled={data?.is_verified || false}
                  onChange={(checked) => handleToggle(checked, "is_verified")}
                />
              </div>

              <div className="flex space-x-3 mt-6 justify-end">
                <Button
                  onClick={toggleEditButton}
                  size="lg"
                  className="bg-gray-100 cursor-pointer text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  onClick={handleSave}
                  className="bg-secondary cursor-pointer text-white font-semibold py-3 rounded-lg hover:bg-secondary/70 transition-colors flex items-center"
                >
                  <SaveIcon size={20} className="mr-2" />
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserInfoCard;
