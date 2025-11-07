import React, { useState } from "react";
import AdminNavbar from "../../components/adminNavbar";
import { FileText, Download, Eye, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getEmployeeReport,
  getCustomerReport,
  getAppointmentReport,
} from "../../api/timeLog";

export default function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch report data from backend API
  const handleViewReport = async (type) => {
    setSelectedReport(type);
    setIsModalOpen(true);
    setLoading(true);

    try {
      let data = [];
      if (type === "employee") data = await getEmployeeReport();
      else if (type === "customer") data = await getCustomerReport();
      else if (type === "appointment") data = await getAppointmentReport();

      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("Failed to fetch report data.");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // Download report as PDF
  const handleDownloadReport = () => {
    if (!reportData || reportData.length === 0) {
      alert("No data to export!");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape", // switch to landscape to fit wide tables
      unit: "pt",
      format: "A4",
    });

    // ==== HEADER SECTION ====
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(`${selectedReport.toUpperCase()} REPORT`, 40, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 70);

    // Optional: draw a separator line
    doc.setDrawColor(0);
    doc.line(40, 80, 800, 80);

    // ==== TABLE SECTION ====
    const columns = Object.keys(reportData[0]).map((key) =>
      key.replace(/_/g, " ").toUpperCase()
    );
    const rows = reportData.map((item) =>
      Object.values(item).map((val) => (val ? String(val) : ""))
    );

    autoTable(doc, {
      startY: 100,
      head: [columns],
      body: rows,
      styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 80 }, // you can adjust column widths if needed
      },
      headStyles: {
        fillColor: [30, 136, 229],
        textColor: 255,
        halign: "center",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      didDrawPage: (data) => {
        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc.internal.pageSize.getWidth() - 80,
          doc.internal.pageSize.getHeight() - 30
        );
      },
    });

    // ==== SAVE FILE ====
    doc.save(`${selectedReport}-report.pdf`);
  };
  // Table Columns for each report
  const getColumns = () => {
    switch (selectedReport) {
      case "employee":
        return [
          { title: "ID", dataIndex: "id" },
          { title: "Name", dataIndex: "name" },
          { title: "Phone", dataIndex: "phone" },
          { title: "Email", dataIndex: "email" },
          { title: "Address", dataIndex: "address" },
          { title: "Date of Birth", dataIndex: "dob" },
          { title: "Date Joined", dataIndex: "date_joined" },
          {
            title: "Total Appointments",
            dataIndex: "total_assigned_appointments",
          },
          {
            title: "Completed Services",
            dataIndex: "total_completed_appointments",
          },
        ];
      case "customer":
        return [
          { title: "ID", dataIndex: "id" },
          { title: "Name", dataIndex: "name" },
          { title: "Phone", dataIndex: "phone" },
          { title: "Email", dataIndex: "email" },
          { title: "Address", dataIndex: "address" },
          { title: "Joined Date", dataIndex: "joineddate" },
          { title: "Total Appointments", dataIndex: "totalappointments" },
        ];
      case "appointment":
        return [
          { title: "Service ID", dataIndex: "service_id" },
          { title: "Title", dataIndex: "title" },
          { title: "Service Type", dataIndex: "service_type" },
          { title: "Vehicle Number", dataIndex: "vehicle_number" },
          { title: "Vehicle Model", dataIndex: "vehicle_model" },
          { title: "Customer", dataIndex: "customer" },
          { title: "Assigned Employee", dataIndex: "assigned_employee" },
          { title: "Scheduled Date", dataIndex: "scheduled_date" },
          { title: "Estimated Hours", dataIndex: "estimated_hours" },
          { title: "Status", dataIndex: "status" },
        ];

      default:
        return [];
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText size={28} /> Reports & Analytics
        </h1>

        {/* Report Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard
            title="Employee Report"
            onView={() => handleViewReport("employee")}
          />
          <ReportCard
            title="Customer Report"
            onView={() => handleViewReport("customer")}
          />
          <ReportCard
            title="Appointment Summary"
            onView={() => handleViewReport("appointment")}
          />
        </div>

        {/* Report Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {selectedReport?.toUpperCase()} REPORT
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                </div>
              ) : reportData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-sky-600 text-white">
                        {Object.keys(reportData[0]).map((key) => (
                          <th key={key} className="p-3">
                            {key.replace(/_/g, " ").toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          {Object.values(item).map((val, i) => (
                            <td key={i} className="p-3">
                              {val || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No data available</p>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-700"
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ReportCard({ title, onView }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition">
      <FileText size={40} className="text-sky-600 mb-4" />
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <button
        onClick={onView}
        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
      >
        <Eye size={18} /> View
      </button>
    </div>
  );
}
