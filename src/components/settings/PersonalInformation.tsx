import { Button } from "@/components/ui/Button";
import { Pencil } from "lucide-react";

export const PersonalInformation = () => {
  return (
    <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Personal Information
        </h2>
        <Button
          size={"sm"}
          className="cursor-pointer bg-secondary hover:bg-secondary/90 text-white"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <p className="text-sm text-gray-500">Full name</p>
          <p className="font-semibold text-lg text-gray-900">Andrew</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last name</p>
          <p className="font-semibold text-lg text-gray-900">Forbeist</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-semibold text-lg text-gray-900">
            +234 802 345 8890
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email Address</p>
          <p className="font-semibold text-lg text-gray-900">
            andrewforbeist@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};
