import styles from "./AdminSettings.module.css";

export default function AdminSettings() {
  return (
    <div className={styles.page}>
      <h1>⚙️ System Settings</h1>

      <div className={styles.grid}>

        <div className={styles.card}>
          <h2>👤 Admin Profile</h2>
          <p>Edit your profile information.</p>

          <button>Edit Profile</button>
        </div>

        <div className={styles.card}>
          <h2>🔒 Security</h2>
          <p>Change password and manage account security.</p>

          <button>Security Settings</button>
        </div>

        <div className={styles.card}>
          <h2>🏢 Company Information</h2>
          <p>Company name, address and logo.</p>

          <button>Manage Company</button>
        </div>

        <div className={styles.card}>
          <h2>📧 Email Settings</h2>
          <p>Configure notification emails.</p>

          <button>Configure</button>
        </div>

        <div className={styles.card}>
          <h2>🗄 Database</h2>
          <p>Backup and restore your system.</p>

          <button>Backup</button>
        </div>

        <div className={styles.card}>
          <h2>🎨 Appearance</h2>
          <p>Choose system theme.</p>

          <button>Customize</button>
        </div>

      </div>
    </div>
  );
}