import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PersonalInformation } from "@/components/settings/PersonalInformation";
import { ProfileSection } from "@/components/settings/ProfileSection";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div>
        <div className="bg-white p-4 md:p-8 rounded-2xl">
          <ProfileSection />
          <PersonalInformation />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
