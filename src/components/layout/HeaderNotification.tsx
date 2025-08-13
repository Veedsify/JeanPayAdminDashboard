import { Bell, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HeaderNotification = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock notification data
  const notifications = [
    {
      id: 1,
      type: "transaction",
      title: "Transaction Completed",
      message: "Your payment of $150.00 has been processed successfully",
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      type: "account",
      title: "Account Created",
      message: "Welcome! Your new account has been set up successfully",
      time: "1 hour ago",
      isRead: false,
    },
    {
      id: 3,
      type: "rates",
      title: "Rate Update",
      message: "New exchange rates are now available - USD/EUR: 0.85",
      time: "3 hours ago",
      isRead: true,
    },
    {
      id: 4,
      type: "transaction",
      title: "Transaction Failed",
      message: "Your payment could not be processed. Please try again",
      time: "5 hours ago",
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return "💳";
      case "account":
        return "👤";
      case "rates":
        return "📈";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer ring-0 border-none outline-0 shadow-none p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 focus:outline-none  rounded-lg transition-colors duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed h-dvh md:h-auto w-full top-0 md:top-10 md:absolute right-0 md:mt-6 md:left-auto md:transform-none md:right-0 md:w-96 bg-white md:rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:px-6 px-4  py-4 border-b border-gray-100 bg-gray-50"
            >
              <div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {unreadCount} unread notification
                      {unreadCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-0 right-0 mt-4 mr-4 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>

            {/* Notifications List */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-h-full md:max-h-96 overflow-y-auto"
            >
              {notifications.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <div className="text-4xl mb-3">🔔</div>
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-gray-400 text-sm mt-1">
                    You&apos;re all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      key={notification.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                        !notification.isRead ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-2xl">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-3 mt-1"></div>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed mb-3">
                            {notification.message}
                          </p>

                          <p className="text-xs text-gray-400 font-medium">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-150">
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default HeaderNotification;
