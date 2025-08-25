import axiosClient from "@/lib/axios";

export interface AdminProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string;
}

export interface AdminProfileUpdateResponse {
    error: boolean;
    message: string;
    data: any;
}

// Update admin profile picture
export async function updateAdminProfilePicture(file: File): Promise<AdminProfileUpdateResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post(
        "/protected/settings/profile-picture",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return response.data;
}

// Update admin profile information
export async function updateAdminProfile(
    profileData: Partial<AdminProfileData>
): Promise<AdminProfileUpdateResponse> {
    // Map the frontend data to backend expected format (based on UpdateProfileRequest struct)
    const backendData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone, // JSON tag is 'phone' but struct field is 'PhoneNumber'
    };

    console.log('Sending profile update data:', backendData);

    const response = await axiosClient.put(
        "/protected/settings/profile",
        backendData,
    );
    return response.data;
}

// Get admin user settings
export async function getAdminUserSettings(): Promise<AdminProfileUpdateResponse> {
    const response = await axiosClient.get("/protected/settings/");
    return response.data;
}

// Change admin password
export async function changeAdminPassword(payload: {
    currentPassword: string;
    newPassword: string
}): Promise<AdminProfileUpdateResponse> {
    const response = await axiosClient.put("/protected/settings/change-password", payload);
    return response.data;
}
