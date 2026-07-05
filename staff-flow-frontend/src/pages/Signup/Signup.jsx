import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "./Signup.module.css";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, department } = form;

    if (!name || !email || !password || !department) {
      return toast.error("Please fill all required fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        department,
      });

      toast.success("Account created successfully");

      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Create Account 🚀</h2>
        <p>Join Staff-Flow HRMS</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <select
  className={styles.input}
  name="department"
  value={form.department}
  onChange={handleChange}
  required
>
  <option value="">-- Select Department --</option>

  <option value="ICT">ICT</option>

  <option value="Business">Business</option>

  <option value="Human Resource">Human Resource (HR)</option>

  <option value="Hospitality">Hospitality</option>

  <option value="Fashion and Design">Fashion and Design</option>

  <option value="Cosmetology">Cosmetology</option>

  <option value="Civil Engineering">Civil Engineering</option>

  <option value="Electrical Engineering">Electrical Engineering</option>

  <option value="Nursing">Nursing</option>
</select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className={styles.bottomText}>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}