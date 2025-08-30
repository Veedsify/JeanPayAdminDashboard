import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllNotifications } from "../funcs/notifications/NotificationFuncs";

export const useNotificationHook = () => {
  const useGetAllNotification = () =>
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam }) =>
        getAllNotifications({
          cursor: pageParam,
        }),
      enabled: true,
      getNextPageParam: (lastPage) => {
        if (lastPage.data.nextCursor) {
          return lastPage.data.nextCursor;
        }
      },
      initialPageParam: 0,
    });
  return { useGetAllNotification };
};

export default useNotificationHook;
