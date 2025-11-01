import React, { useState, useEffect } from 'react';
import { getMyNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api/employeeApi';
import { FiBell, FiX, FiCheck, FiCheckCircle, FiAlertCircle, FiClock, FiPackage } from 'react-icons/fi';

export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await getMyNotifications();
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await markAllNotificationsAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <FiCheckCircle className="text-blue-500" />;
      case 'status_change':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'approval':
        return <FiCheck className="text-green-500" />;
      case 'parts_request':
        return <FiPackage className="text-purple-500" />;
      case 'reminder':
        return <FiClock className="text-orange-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50';
      default:
        return 'border-l-4 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-white/20 rounded-lg transition"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          ></div>

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-sky-50 to-blue-50">
              <div>
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <p className="text-xs text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium disabled:opacity-50"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiBell size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                        !notification.is_read ? 'bg-blue-50/50' : ''
                      } ${getPriorityStyle(notification.priority)}`}
                      onClick={() => {
                        if (!notification.is_read) {
                          handleMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`font-semibold text-sm ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.service_title && (
                            <p className="text-xs text-sky-600 mt-1 font-medium">
                              Service: {notification.service_title}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 5 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
