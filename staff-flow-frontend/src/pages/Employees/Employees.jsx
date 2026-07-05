import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Employees.module.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    department: "",
    role: "user",
    position: "",
    phone: "",
    address: "",
    gender: "",
    annual_leave_balance: 24,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const result = employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredEmployees(result);
  }, [search, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/admin/employees");

      setEmployees(res.data);
      setFilteredEmployees(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const clearForm = () => {
    setForm({
      id: "",
      name: "",
      email: "",
      password: "",
      department: "",
      role: "user",
      position: "",
      phone: "",
      address: "",
      gender: "",
      annual_leave_balance: 24,
    });
  };

  const deleteEmployee = async (id) => {

    if (!window.confirm("Delete this employee?")) return;

    try {

      await api.delete(`/admin/employees/${id}`);

      fetchEmployees();

    } catch (err) {
      console.log(err);
    }

  };

  const updateEmployee = async () => {

    try {

      await api.put(`/admin/employees/${form.id}`, form);

      fetchEmployees();

      setEditing(false);

      clearForm();

      alert("Employee updated successfully");

    } catch (err) {

      console.log(err);

    }

  };

  const addEmployee = async () => {

    try {

      await api.post("/admin/employees", form);

      fetchEmployees();

      setAdding(false);

      clearForm();

      alert("Employee added successfully");

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <div className={styles.container}>

      <div className={styles.header}>

        <h1>Employees</h1>

        <button
          className={styles.addBtn}
          onClick={() => {
            clearForm();
            setAdding(true);
          }}
        >
          + Add Employee
        </button>

      </div>

      <input
        className={styles.search}
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className={styles.table}>

        <thead>

          <tr>

            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Role</th>
            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filteredEmployees.map((emp) => (

            <tr key={emp.id}>

              <td>

                <img
                  className={styles.avatar}
                  src={
                    emp.profile_picture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      emp.name
                    )}`
                  }
                  alt={emp.name}
                />

              </td>

              <td>{emp.name}</td>

              <td>{emp.email}</td>

              <td>{emp.department}</td>

              <td>{emp.position}</td>

              <td>

                <span
                  className={
                    emp.role === "admin"
                      ? styles.admin
                      : styles.user
                  }
                >
                  {emp.role}
                </span>

              </td>

              <td>

                <button
                  className={styles.editBtn}
                  onClick={() => {

                    setEditing(true);

                    setForm({
                      id: emp.id,
                      name: emp.name,
                      email: emp.email,
                      password: "",
                      department: emp.department,
                      role: emp.role,
                      position: emp.position,
                      phone: emp.phone,
                      address: emp.address,
                      gender: emp.gender,
                      annual_leave_balance:
                        emp.annual_leave_balance,
                    });

                  }}
                >
                  Edit
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteEmployee(emp.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
            {/* ================= EDIT EMPLOYEE MODAL ================= */}

      {editing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h2>Edit Employee</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Position"
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="number"
              placeholder="Annual Leave Balance"
              value={form.annual_leave_balance}
              onChange={(e) =>
                setForm({
                  ...form,
                  annual_leave_balance: e.target.value,
                })
              }
            />

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => {
                  setEditing(false);
                  clearForm();
                }}
              >
                Cancel
              </button>

              <button
                className={styles.save}
                onClick={updateEmployee}
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= ADD EMPLOYEE MODAL ================= */}

      {adding && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h2>Add Employee</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Department"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Position"
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <select
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => {
                  setAdding(false);
                  clearForm();
                }}
              >
                Cancel
              </button>

              <button
                className={styles.save}
                onClick={addEmployee}
              >
                Add Employee
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}