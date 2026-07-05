import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import styles from "./Departments.module.css";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editing, setEditing] = useState(null);

  const loadDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const saveDepartment = async () => {
    if (!name.trim()) {
      return alert("Department name is required");
    }

    try {
      if (editing) {
        await api.put(`/departments/${editing}`, {
          name,
          description,
        });

        alert("Department updated successfully.");
      } else {
        await api.post("/departments", {
          name,
          description,
        });

        alert("Department added successfully.");
      }

      setName("");
      setDescription("");
      setEditing(null);

      loadDepartments();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const editDepartment = (department) => {
    setEditing(department.id);
    setName(department.name);
    setDescription(department.description || "");
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/departments/${id}`);
      loadDepartments();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) =>
      department.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const totalEmployees = departments.reduce(
    (sum, dept) => sum + Number(dept.employees),
    0
  );

  const largestDepartment =
    departments.length > 0
      ? [...departments].sort(
          (a, b) => b.employees - a.employees
        )[0]
      : null;

  return (
    <div className={styles.page}>
      <h1>🏢 Departments</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Departments</h3>
          <h2>{departments.length}</h2>
        </div>

        <div className={styles.card}>
          <h3>Total Employees</h3>
          <h2>{totalEmployees}</h2>
        </div>

        <div className={styles.card}>
          <h3>Largest Department</h3>
          <h2>
            {largestDepartment
              ? largestDepartment.name
              : "--"}
          </h2>
        </div>
      </div>

      <div className={styles.form}>
        <input
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={saveDepartment}>
          {editing ? "Update Department" : "Add Department"}
        </button>
      </div>

      <input
        className={styles.search}
        placeholder="🔍 Search department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.grid}>
        {filteredDepartments.map((department) => (
          <div
            className={styles.departmentCard}
            key={department.id}
          >
            <h2>🏢 {department.name}</h2>

            <p>
              {department.description ||
                "No description available."}
            </p>

            <h4>
              👥 {department.employees} Employees
            </h4>

            <div className={styles.actions}>
              <button
                className={styles.edit}
                onClick={() =>
                  editDepartment(department)
                }
              >
                ✏ Edit
              </button>

              <button
                className={styles.delete}
                onClick={() =>
                  deleteDepartment(department.id)
                }
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}