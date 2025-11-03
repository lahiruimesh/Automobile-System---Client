import AdminNavbar from "../../components/adminNavbar";
import { FileText, Download } from "lucide-react";

export default function Reports() {
  const handleGenerateReport = (type) => {
    alert(`Generating ${type} report...`);
    // fetch(`/api/admin/reports/${type}`)
  };

  return (
    <>
      <AdminNavbar />
      <div className="pt-20 px-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText size={28} /> Reports & Analytics
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard
            title="Employee Report"
            onDownload={() => handleGenerateReport("employee")}
          />
          <ReportCard
            title="Customer Report"
            onDownload={() => handleGenerateReport("customer")}
          />
          <ReportCard
            title="Appointment Summary"
            onDownload={() => handleGenerateReport("appointment")}
          />
        </div>
      </div>
    </>
  );
}

function ReportCard({ title, onDownload }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
      <FileText size={40} className="text-sky-600 mb-4" />
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <button
        onClick={onDownload}
        className="bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-700"
      >
        <Download size={18} /> Download
      </button>
    </div>
  );
}
