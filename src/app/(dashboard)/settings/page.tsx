"use client";
import { useAuthContext } from "@/components/contexts/UserAuthContext";
import useAdminUserSettings from "@/data/hooks/AdminUserSettingsHook";
import { PersonalInformation } from "@/components/settings/PersonalInformation";
import { ProfileSection } from "@/components/settings/ProfileSection";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { user } = useAuthContext();
  const { updateProfile } = useAdminUserSettings();

  // Transform user data to match ProfileData interface
  const profileData = {
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone_number || "",
    profileImage: user?.profile_picture || "",
  };

  const handleProfileUpdate = async (updatedData: typeof profileData) => {
    try {
      toast.loading("Updating profile...", { id: "profile-update" });

      await updateProfile.mutateAsync({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phone: updatedData.phone,
      });

      toast.success("Profile updated successfully!", { id: "profile-update" });
    } catch (error) {
      toast.error("Failed to update profile", { id: "profile-update" });
      console.error("Profile update error:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-4 md:p-8 rounded-2xl">
        <ProfileSection
          profileData={profileData}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
