import React, { useState, useEffect } from 'react';
import { getScheduledServices, getMyAvailability } from '../api/employeeApi';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiTool } from 'react-icons/fi';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const [servicesRes, availabilityRes] = await Promise.all([
        getScheduledServices(month, year),
        getMyAvailability(month, year)
      ]);

      setServices(servicesRes.data.services || []);
      setAvailability(availabilityRes.data.availability || []);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getServicesForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return services.filter(s => s.scheduled_date && s.scheduled_date.startsWith(dateStr));
  };

  const getAvailabilityForDate = (date) => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return availability.find(a => a.date.startsWith(dateStr));
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiCalendar className="text-sky-600" />
            Service Calendar
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition text-sm font-medium"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiChevronLeft size={20} />
          </button>
          <span className="font-semibold text-gray-800 min-w-[200px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Urgent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-gray-600">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 rounded border-2 border-green-500"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 rounded border-2 border-red-500"></div>
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Week Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {weekDays.map(day => (
                <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((date, index) => {
                const dayServices = getServicesForDate(date);
                const dayAvailability = getAvailabilityForDate(date);
                const isCurrentDay = isToday(date);
                const isPastDay = isPast(date);

                return (
                  <div
                    key={index}
                    className={`min-h-[120px] border-b border-r border-gray-200 p-2 ${
                      !date ? 'bg-gray-50' : ''
                    } ${isPastDay ? 'bg-gray-50/50' : 'bg-white'} ${
                      isCurrentDay ? 'bg-sky-50 border-sky-300' : ''
                    } hover:bg-gray-50 transition cursor-pointer`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        {/* Date Number */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${
                            isCurrentDay
                              ? 'bg-sky-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                              : isPastDay
                              ? 'text-gray-400'
                              : 'text-gray-700'
                          }`}>
                            {date.getDate()}
                          </span>
                          
                          {/* Availability Indicator */}
                          {dayAvailability && (
                            <div className={`w-2 h-2 rounded-full ${
                              dayAvailability.is_available
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`} title={dayAvailability.reason || 'Availability set'}></div>
                          )}
                        </div>

                        {/* Services */}
                        <div className="space-y-1">
                          {dayServices.slice(0, 3).map((service, idx) => (
                            <div
                              key={service.id}
                              className={`text-xs p-1 rounded ${getPriorityColor(service.priority)} text-white truncate`}
                              title={`${service.title} - ${service.vehicle_number}`}
                            >
                              <div className="flex items-center gap-1">
                                <FiTool size={10} />
                                <span className="truncate">{service.title}</span>
                              </div>
                            </div>
                          ))}
                          {dayServices.length > 3 && (
                            <div className="text-xs text-gray-500 font-medium">
                              +{dayServices.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="mt-6 bg-sky-50 rounded-lg p-4 border border-sky-200">
              <h3 className="font-bold text-gray-800 mb-3">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              {(() => {
                const dayServices = getServicesForDate(selectedDate);
                const dayAvailability = getAvailabilityForDate(selectedDate);
                
                return (
                  <div className="space-y-3">
                    {/* Availability */}
                    {dayAvailability && (
                      <div className={`p-3 rounded-lg ${
                        dayAvailability.is_available 
                          ? 'bg-green-100 border border-green-300' 
                          : 'bg-red-100 border border-red-300'
                      }`}>
                        <p className={`font-semibold ${
                          dayAvailability.is_available ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {dayAvailability.is_available ? 'Available' : 'Unavailable'}
                        </p>
                        {dayAvailability.reason && (
                          <p className="text-sm text-gray-700 mt-1">{dayAvailability.reason}</p>
                        )}
                        {dayAvailability.start_time && dayAvailability.end_time && (
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <FiClock size={14} />
                            {dayAvailability.start_time} - {dayAvailability.end_time}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Services */}
                    {dayServices.length > 0 ? (
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">
                          Scheduled Services ({dayServices.length})
                        </p>
                        <div className="space-y-2">
                          {dayServices.map(service => (
                            <div key={service.id} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{service.title}</p>
                                  <p className="text-sm text-gray-600">{service.vehicle_number} - {service.vehicle_model}</p>
                                  <p className="text-sm text-gray-600">{service.customer_name}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(service.priority)} text-white`}>
                                  {service.priority}
                                </span>
                              </div>
                              {service.estimated_hours && (
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                  <FiClock size={12} />
                                  Estimated: {service.estimated_hours}h
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No services scheduled for this day</p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
