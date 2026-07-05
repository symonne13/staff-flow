import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Reports.module.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadReport = async () => {
    try {
      setLoading(true);

      const res = await api.get("/reports/attendance", {
        params: {
          date,
          department,
          search,
        },
      });

      setReport(res.data.report || []);
      setSummary(
        res.data.summary || {
          total: 0,
          present: 0,
          absent: 0,
          onLeave: 0,
        }
      );

      setDepartments(["All", ...(res.data.departments || [])]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReport();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, department, date]);

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      report.map((emp) => ({
        Employee: emp.name,
        Department: emp.department,
        Position: emp.position,
        CheckIn: emp.check_in || "--",
        CheckOut: emp.check_out || "--",
        Status: emp.status,
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "Attendance_Report.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("Staff Flow Attendance Report", 14, 20);

    doc.setFontSize(11);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      30
    );

    autoTable(doc, {
      startY: 40,

      head: [[
        "Employee",
        "Department",
        "Position",
        "Check In",
        "Check Out",
        "Status",
      ]],

      body: report.map((emp) => [
        emp.name,
        emp.department,
        emp.position,
        emp.check_in
          ? new Date(emp.check_in).toLocaleTimeString()
          : "--",
        emp.check_out
          ? new Date(emp.check_out).toLocaleTimeString()
          : "--",
        emp.status,
      ]),
    });

    doc.save("Attendance_Report.pdf");
  };
    return (
    <div className={styles.page}>
      <h1>📊 Attendance Reports</h1>

      {/* Summary Cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>👥 Employees</h3>
          <h2>{summary.total}</h2>
        </div>

        <div className={styles.card}>
          <h3>🟢 Present</h3>
          <h2>{summary.present}</h2>
        </div>

        <div className={styles.card}>
          <h3>🔴 Absent</h3>
          <h2>{summary.absent}</h2>
        </div>

        <div className={styles.card}>
          <h3>🟡 On Leave</h3>
          <h2>{summary.onLeave}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="🔍 Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={loadReport}>
          🔄 Generate Report
        </button>

        <button onClick={() => window.print()}>
          🖨 Print
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          ⏳ Loading attendance report...
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Position</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {report.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 30 }}>
                  No attendance records found.
                </td>
              </tr>
            ) : (
              report.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>

                  <td>{employee.department}</td>

                  <td>{employee.position}</td>

                  <td>
                    {employee.check_in
                      ? new Date(employee.check_in).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td>
                    {employee.check_out
                      ? new Date(employee.check_out).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td>
                    <span
                      className={`${styles.badge} ${
                        employee.status === "ON_LEAVE"
                          ? styles.leave
                          : employee.status === "NOT_IN_OFFICE"
                          ? styles.absent
                          : styles.present
                      }`}
                    >
                      {employee.status === "IN_OFFICE" && "🟢 Present"}
                      {employee.status === "NOT_IN_OFFICE" && "🔴 Checked Out"}
                      {employee.status === "ON_LEAVE" && "🟡 On Leave"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export Buttons */}
      <div className={styles.exportButtons}>
        <button onClick={exportPDF}>
          📄 Export PDF
        </button>

        <button onClick={exportExcel}>
          📊 Export Excel
        </button>
      </div>
    </div>
  );
}