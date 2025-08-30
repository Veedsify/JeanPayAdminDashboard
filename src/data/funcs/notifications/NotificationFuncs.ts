import axiosClient from "@/lib/axios";

const path = {
  NotificationsBase: "/protected/notifications",
  NotificationsAll: "/all",
  NotificationsMarkRead: "/mark-read/:id",
  NotificationMarkReadBulk: "/mark-read-bulk",
  NotificationsMarkAllRead: "/mark-all-read",
  NotificationDeleteBulk: "/delete-bulk",
};

export type GetAllNotficationsResponse = {
  error: string;
  data: {
    notifications: Notification[];
    nextCursor: number | null;
    unread_count: number;
  };
};

type NotificationParam = {
  cursor: number;
};

const getAllNotifications = async ({
  cursor,
}: NotificationParam): Promise<GetAllNotficationsResponse> => {
  const response = await axiosClient.get(
    path.NotificationsBase + path.NotificationsAll,
    { params: { ...(cursor && cursor != 0 && { cursor }) } },
  );
  return response.data;
};

export { getAllNotifications };
