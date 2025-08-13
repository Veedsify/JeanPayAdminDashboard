import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

export const ProfileSection = () => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800">Manage Your Profile</h2>
      <p className="text-sm text-gray-500 mb-4">
        Update your profile information
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="md:flex items-center justify-between space-y-6">
          <div className="md:flex items-center space-x-4">
            <Image
              src="/avatar.jpg" // Placeholder path, assuming image is in /public
              alt="User Avatar"
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold text-lg text-gray-900">
                Andrew Forbist
              </p>
              <p className="text-sm text-gray-500">Nigeria</p>
            </div>
          </div>
          <Button
            size={"sm"}
            className="cursor-pointer bg-secondary hover:bg-secondary/90 text-white"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
