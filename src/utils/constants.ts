export const AcceptedImageTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/gif",
] as const;

export const AcceptedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
] as const;

export const MaxFileSizeProfilePicture = 3 * 1024 * 1024; // 3MB
