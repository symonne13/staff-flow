import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClipboardCheck,
  FaCalendarAlt,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import styles from "./Landing.module.css";

export default function Landing() {
  const features = [
    {
      icon: <FaClipboardCheck />,
      title: "Attendance Management",
      description:
        "Track employee check-ins and check-outs in real time with accurate attendance records.",
    },
    {
      icon: <FaCalendarAlt />,
      title: "Leave Management",
      description:
        "Employees can request leave online while managers approve or reject requests instantly.",
    },
    {
      icon: <FaUsers />,
      title: "Employee Records",
      description:
        "Manage employee profiles, departments, roles, and contact information in one secure place.",
    },
    {
      icon: <FaChartLine />,
      title: "Analytics & Reports",
      description:
        "Visual dashboards and reports provide valuable workforce insights for administrators.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>SF</div>

          <div>
            <h2>Staff-Flow</h2>
            <span>Enterprise HRMS</span>
          </div>
        </div>

        <nav className={styles.navLinks}>
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>

          <Link to="/signup" className={styles.signupBtn}>
            Create Account
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroLeft}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.badge}>
            Modern Human Resource Management
          </span>

          <h1>
            Smart Workforce <br />
            Management Made Simple
          </h1>

          <p>
            Staff-Flow is a complete Human Resource Management System designed
            to simplify employee management, attendance, leave requests,
            payroll, notifications and analytics from one secure platform.
          </p>

          <div className={styles.heroButtons}>
            <Link to="/signup" className={styles.primaryBtn}>
              Get Started
            </Link>

            <Link to="/login" className={styles.secondaryBtn}>
              Login
            </Link>
          </div>
        </motion.div>

       
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Everything You Need</h2>

          <p>
            Staff-Flow provides powerful HR tools that help organizations
            manage employees efficiently.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              whileHover={{ y: -8 }}
            >
              <div className={styles.icon}>{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <motion.div
          className={styles.ctaCard}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Ready to transform your workforce management?</h2>

          <p>
            Secure. Reliable. Fast. Everything your organization needs in one
            modern HR platform.
          </p>

          <Link to="/signup" className={styles.ctaButton}>
            Start Now
            <FaArrowRight />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
