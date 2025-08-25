"use client";
import { useState, useRef } from "react";
import { Edit, Camera } from "lucide-react";
import Image from "next/image";
import { useAuthContext } from "../contexts/UserAuthContext";
import useAdminUserSettings from "@/data/hooks/AdminUserSettingsHook";
import toast from "react-hot-toast";
import {
  AcceptedImageTypes,
  MaxFileSizeProfilePicture,
} from "@/utils/constants";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface ProfileSectionProps {
  profileData: ProfileData;
  onProfileUpdate: (updatedData: ProfileData) => void;
}

export const ProfileSection = ({
  profileData,
  onProfileUpdate,
}: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localProfileData, setLocalProfileData] = useState(profileData);
  const { refreshUser, user } = useAuthContext();
  const { updateProfilePicture } = useAdminUserSettings();
  const [previewImage, setPreviewImage] = useState(
    profileData?.profileImage || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalProfileData({ ...localProfileData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!AcceptedImageTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a valid image.");
        return;
      }
      if (file.size > MaxFileSizeProfilePicture) {
        toast.error("File size exceeds the limit. 3mb Max.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImageData = reader.result as string;
        setPreviewImage(newImageData);
      };
      reader.readAsDataURL(file);
      toast.loading("Updating profile picture...", {
        id: "profile-picture-update",
      });
      updateProfilePicture.mutate(file, {
        onSuccess: () => {
          const updatedProfileData = {
            ...localProfileData,
            profileImage: previewImage,
          };
          toast.success("Profile picture updated successfully!", {
            id: "profile-picture-update",
          });
          refreshUser();
          setLocalProfileData(updatedProfileData);
        },
        onError: () => {
          toast.error("Error updating profile picture:", {
            id: "profile-picture-update",
          });
        },
        onSettled: () => {
          setIsEditing(false);
        },
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileUpdate(localProfileData);
    setIsEditing(false);
  };

  return (
    <div className="">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 md:mb-2">
          Manage Your Profile
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Update your profile information
        </p>
      </div>

      {/* Profile Header with Image */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div
                className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-400 transition-colors"
                onClick={triggerFileInput}
              >
                {previewImage ? (
                  <Image
                    width={64}
                    height={64}
                    src={previewImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                    <Camera size={20} className="md:size-6 text-gray-600" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-semibold text-gray-900">
                {localProfileData?.firstName} {localProfileData?.lastName}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                {user?.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm md:text-base"
          >
            <Edit size={14} className="md:size-4" />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
        >
          {/* First Name */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              First name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="firstName"
                value={localProfileData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
              />
            ) : (
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {localProfileData?.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Last name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="lastName"
                value={localProfileData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
              />
            ) : (
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {localProfileData?.lastName}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={localProfileData.phone}
                onChange={handleChange}
                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
              />
            ) : (
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {localProfileData?.phone}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={localProfileData.email}
                onChange={handleChange}
                className="w-full px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm md:text-base"
              />
            ) : (
              <div className="text-base md:text-lg font-semibold text-gray-900">
                {localProfileData?.email}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="md:col-span-2 mt-4 md:mt-6 flex flex-col sm:flex-row justify-end gap-2 md:gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setLocalProfileData(profileData);
                  setPreviewImage(profileData.profileImage || "");
                }}
                className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 cursor-pointer text-sm md:text-base"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
