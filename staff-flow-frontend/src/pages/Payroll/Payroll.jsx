import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import styles from "./Payroll.module.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default function Payroll() {
  const [payroll, setPayroll] = useState([]);
  const [summary, setSummary] = useState({
    employees: 0,
    totalPayroll: 0,
    averageSalary: 0,
  });

  const [loading, setLoading] = useState(false);
const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [month, setMonth] = useState("All");
const [employees, setEmployees] = useState([]);
  // Form State (used in Part 2)
const [employee, setEmployee] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [allowances, setAllowances] = useState("");
  const [deductions, setDeductions] = useState("");
  const [overtime, setOvertime] = useState("");
const netSalary =
  Number(basicSalary || 0) +
  Number(allowances || 0) +
  Number(overtime || 0) -
  Number(deductions || 0);
  const departments = useMemo(() => {
    return [
      "All",
      ...new Set(payroll.map((p) => p.department)),
    ];
  }, [payroll]);

  const months = useMemo(() => {
    return [
      "All",
      ...new Set(payroll.map((p) => p.month)),
    ];
  }, [payroll]);
const loadEmployees = async () => {
  try {
    const res = await api.get("/payroll/employees");
    setEmployees(res.data);
  } catch (err) {
    console.log(err);
  }
};
const savePayroll = async () => {
  if (!employee)
    return alert("Select an employee");

  if (!basicSalary)
    return alert("Enter basic salary");

  try {
    await api.post("/payroll", {
      user_id: employee,
      basic_salary: basicSalary,
      allowances,
      deductions,
      overtime,
      month: new Date().toLocaleString("default", {
        month: "long",
      }),
      year: new Date().getFullYear(),
    });

    alert("Payroll added successfully.");

    setEmployee("");
    setBasicSalary("");
    setAllowances("");
    setDeductions("");
    setOvertime("");

    loadPayroll();

  } catch (err) {
    console.log(err);
  }
};
const deletePayroll = async (id) => {
  const ok = window.confirm(
    "Delete this payroll record?"
  );

  if (!ok) return;

  try {
    await api.delete(`/payroll/${id}`);

    alert("Payroll deleted successfully.");

    loadPayroll();

  } catch (err) {
    console.log(err);
  }
};
const editPayroll = (item) => {
  setEditingId(item.id);

  setEmployee(item.user_id);
  setBasicSalary(item.basic_salary);
  setAllowances(item.allowances);
  setDeductions(item.deductions);
  setOvertime(item.overtime);
};
const updatePayroll = async () => {
  try {
    await api.put(`/payroll/${editingId}`, {
      basic_salary: basicSalary,
      allowances,
      deductions,
      overtime,
      month: new Date().toLocaleString("default", {
        month: "long",
      }),
      year: new Date().getFullYear(),
    });

    alert("Payroll updated successfully.");

    setEditingId(null);

    setEmployee("");
    setBasicSalary("");
    setAllowances("");
    setDeductions("");
    setOvertime("");

    loadPayroll();

  } catch (err) {
    console.log(err);
  }
};
const generatePayslip = (item) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("STAFF FLOW", 14, 20);

  doc.setFontSize(14);
  doc.text("Employee Payslip", 14, 30);

  autoTable(doc, {
    startY: 40,
    body: [
      ["Employee", item.name],
      ["Department", item.department],
      ["Position", item.position],
      ["Month", `${item.month} ${item.year}`],
      ["Basic Salary", `KSh ${Number(item.basic_salary).toLocaleString()}`],
      ["Allowances", `KSh ${Number(item.allowances).toLocaleString()}`],
      ["Overtime", `KSh ${Number(item.overtime).toLocaleString()}`],
      ["Deductions", `KSh ${Number(item.deductions).toLocaleString()}`],
      ["Net Salary", `KSh ${Number(item.net_salary).toLocaleString()}`],
    ],
  });

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.save(`${item.name}-Payslip.pdf`);
};
const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    filteredPayroll.map((p) => ({
      Employee: p.name,
      Department: p.department,
      Position: p.position,
      Month: `${p.month} ${p.year}`,
      BasicSalary: p.basic_salary,
      Allowances: p.allowances,
      Overtime: p.overtime,
      Deductions: p.deductions,
      NetSalary: p.net_salary,
    }))
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Payroll"
  );

  const excelBuffer = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });

  saveAs(
    new Blob([excelBuffer]),
    "Payroll_Report.xlsx"
  );
};
  const loadPayroll = async () => {
    try {
      setLoading(true);

      const res = await api.get("/payroll");

      setPayroll(res.data.payroll);
      setSummary(res.data.summary);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayroll();
     loadEmployees();
  }, []);

  const filteredPayroll = payroll.filter((item) => {

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All" ||
      item.department === department;

    const matchesMonth =
      month === "All" ||
      item.month === month;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesMonth
    );
  });

  return (
    <div className={styles.page}>

      <h1>💰 Payroll Management</h1>

      {/* SUMMARY CARDS */}

      <div className={styles.cards}>

        <div className={styles.card}>
          <h3>Employees</h3>
          <h2>{summary.employees}</h2>
        </div>

        <div className={styles.card}>
          <h3>Total Payroll</h3>
          <h2>
            KSh {Number(summary.totalPayroll).toLocaleString()}
          </h2>
        </div>

        <div className={styles.card}>
          <h3>Average Salary</h3>
          <h2>
            KSh {Number(summary.averageSalary).toLocaleString()}
          </h2>
        </div>

      </div>

      {/* FILTERS */}

      <div className={styles.filters}>

        <input
          type="text"
          placeholder="🔍 Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
        >
          {departments.map((dep) => (
            <option key={dep}>
              {dep}
            </option>
          ))}
        </select>

        <select
          value={month}
          onChange={(e) =>
            setMonth(e.target.value)
          }
        >
          {months.map((m) => (
            <option key={m}>
              {m}
            </option>
          ))}
        </select>

      </div>

      {loading ? (

        <div className={styles.loading}>
          Loading Payroll...
        </div>

      ) : (

        <div className={styles.info}>
          Showing {filteredPayroll.length} payroll records.
        </div>

      )}
<div className={styles.form}>

  <h2>Add Payroll</h2>

  <select
    value={employee}
    onChange={(e) => setEmployee(e.target.value)}
  >
    <option value="">
      Select Employee
    </option>

    {employees.map((emp) => (
      <option
        key={emp.id}
        value={emp.id}
      >
        {emp.name} — {emp.department}
      </option>
    ))}
  </select>

  <input
    type="number"
    placeholder="Basic Salary"
    value={basicSalary}
    onChange={(e) =>
      setBasicSalary(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Allowances"
    value={allowances}
    onChange={(e) =>
      setAllowances(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Overtime"
    value={overtime}
    onChange={(e) =>
      setOvertime(e.target.value)
    }
  />

  <input
    type="number"
    placeholder="Deductions"
    value={deductions}
    onChange={(e) =>
      setDeductions(e.target.value)
    }
  />

  <div className={styles.netSalary}>
    Net Salary:

    <strong>
      KSh {netSalary.toLocaleString()}
    </strong>
  </div>

 <button
  onClick={
    editingId
      ? updatePayroll
      : savePayroll
  }
  className={styles.save}
>
  {editingId
    ? "✏ Update Payroll"
    : "💾 Save Payroll"}
</button>

</div>
    <div className={styles.tableWrapper}>

<table className={styles.table}>

<thead>

<tr>

<th>Employee</th>

<th>Department</th>

<th>Month</th>

<th>Basic</th>

<th>Allowance</th>

<th>Overtime</th>

<th>Deductions</th>

<th>Net Salary</th>

<th>Actions</th>

</tr>

</thead>

<tbody>

{filteredPayroll.length === 0 ? (

<tr>

<td
colSpan="9"
style={{ textAlign: "center" }}
>

No payroll records found.

</td>

</tr>

) : (

filteredPayroll.map((item) => (

<tr key={item.id}>

<td>{item.name}</td>

<td>{item.department}</td>

<td>

{item.month} {item.year}

</td>

<td>

KSh{" "}

{Number(
item.basic_salary
).toLocaleString()}

</td>

<td>

KSh{" "}

{Number(
item.allowances
).toLocaleString()}

</td>

<td>

KSh{" "}

{Number(
item.overtime
).toLocaleString()}

</td>

<td>

KSh{" "}

{Number(
item.deductions
).toLocaleString()}

</td>

<td>

<strong>

KSh{" "}

{Number(
item.net_salary
).toLocaleString()}

</strong>
</td>
<td>
<button
  className={styles.edit}
  onClick={() => editPayroll(item)}
>
  ✏ Edit
</button>

<button
className={styles.delete}
onClick={() =>
deletePayroll(item.id)
}
>

🗑 Delete

</button>
<button
  className={styles.pdf}
  onClick={() => generatePayslip(item)}
>
  📄 Payslip
</button>
<div className={styles.exportButtons}>
  <button onClick={exportExcel}>
    📊 Export Excel
  </button>
</div>
</td>

</tr>

))

)}

</tbody>

</table>

</div>
    </div>
  );
}