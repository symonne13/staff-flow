import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

 try {
  setLoading(true);

  const res = await api.post("/auth/login", form);

  // Save authentication
  localStorage.setItem("token", res.data.token);

  // Save logged-in user information
  localStorage.setItem("userId", res.data.user.id);
  localStorage.setItem("name", res.data.user.name);
  localStorage.setItem("email", res.data.user.email);
  localStorage.setItem("department", res.data.user.department);
  localStorage.setItem("role", res.data.user.role);

  toast.success("Login successful");

  // Redirect based on role
  if (res.data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }

} catch (err) {
  toast.error(err.response?.data?.message || "Login failed");
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
        <h2>Welcome Back 👋</h2>
        <p>Login to Staff-Flow</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.bottomText}>
          Don't have an account?{" "}
          <Link to="/signup">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}