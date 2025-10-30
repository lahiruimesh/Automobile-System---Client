import React from "react";
import { FiTrendingUp, FiCalendar, FiClock } from "react-icons/fi";

export default function TimeReportChart({ weeklyData, monthlyData }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const getBarHeight = (hours, maxHours) => {
    if (!maxHours || maxHours === 0) return 0;
    return Math.min((hours / maxHours) * 100, 100);
  };

  const maxWeeklyHours = weeklyData?.dailyBreakdown
    ? Math.max(...weeklyData.dailyBreakdown.map((day) => parseFloat(day.total_hours)), 8)
    : 8;

  return (
    <div className="space-y-6">
      {/* Weekly Report */}
      {weeklyData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiCalendar className="text-sky-500" />
              Weekly Time Report
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold text-sky-600">
                {parseFloat(weeklyData.totalWeekHours).toFixed(1)} hrs
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="mt-6">
            {weeklyData.dailyBreakdown && weeklyData.dailyBreakdown.length > 0 ? (
              <div className="flex items-end justify-between gap-2 h-48">
                {weeklyData.dailyBreakdown.map((day, index) => {
                  const hours = parseFloat(day.total_hours);
                  const height = getBarHeight(hours, maxWeeklyHours);

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col items-center justify-end h-40">
                        <span className="text-sm font-semibold text-sky-600 mb-1">
                          {hours.toFixed(1)}h
                        </span>
                        <div
                          className="w-full bg-gradient-to-t from-sky-500 to-sky-400 rounded-t-lg transition-all duration-300 hover:from-sky-600 hover:to-sky-500"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-xs font-medium text-gray-700">
                          {formatDate(day.date)}
                        </p>
                        <p className="text-xs text-gray-500">{day.entry_count} entries</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No time logs for this week</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly Report */}
      {monthlyData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-sky-500" />
              Monthly Service Breakdown
            </h3>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Hours</p>
              <p className="text-2xl font-bold text-sky-600">
                {parseFloat(monthlyData.totalMonthHours).toFixed(1)} hrs
              </p>
            </div>
          </div>

          {/* Service List */}
          <div className="space-y-3 mt-4">
            {monthlyData.serviceBreakdown && monthlyData.serviceBreakdown.length > 0 ? (
              monthlyData.serviceBreakdown.map((service, index) => {
                const hours = parseFloat(service.total_hours);
                const percentage = (hours / parseFloat(monthlyData.totalMonthHours)) * 100;

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-sky-300 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{service.service_title}</h4>
                        <p className="text-sm text-gray-500">
                          {service.vehicle_number} • {service.service_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-sky-600">{hours.toFixed(1)} hrs</p>
                        <p className="text-xs text-gray-500">{service.entry_count} entries</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-sky-400 to-sky-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {new Date(service.first_entry).toLocaleDateString()} -{" "}
                        {new Date(service.last_entry).toLocaleDateString()}
                      </span>
                      <span>{percentage.toFixed(1)}% of monthly hours</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiClock className="mx-auto mb-2" size={32} />
                <p>No time logs for this month</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
