import { useEffect, useState } from "react";
import api from "../../api/axios";

import styles from "./AdminSettings.module.css";

export default function Settings() {
 const [profile, setProfile] = useState({
  name: "",
  email: "",
  phone: "",
  address: "",
  gender: "",
  position: "",
  department: "",
  role: "",
});

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };
useEffect(() => {
  const loadProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await api.get(`/profile?id=${userId}`);

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        gender: res.data.gender || "",
        position: res.data.position || "",
        department: res.data.department || "",
        role: res.data.role || "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  loadProfile();
}, []);
const [selectedImage, setSelectedImage] = useState(null);
const handleSave = async () => {
  try {
    await api.put("/profile/update", {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      gender: profile.gender,
      position: profile.position,
      department: profile.department,
      role: profile.role,
    });

    alert("Profile updated successfully");
  } catch (err) {
    console.log(err);
    alert("Failed to update profile");
  }
};
const uploadPicture = async () => {
  if (!selectedImage) {
    return alert("Please choose an image first.");
  }

  const formData = new FormData();
  formData.append("profile", selectedImage);

  try {
    const res = await api.post(
      "/profile/upload-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Profile picture updated!");

    setProfile({
      ...profile,
      profile_picture: res.data.image,
    });

    localStorage.setItem(
      "profilePicture",
      `http://localhost:5000${res.data.image}`
    );

    window.dispatchEvent(new Event("profileUpdated"));

  } catch (err) {
    console.log(err);
    alert("Upload failed.");
  }
};
const role = localStorage.getItem("role");

const [activeTab, setActiveTab] = useState("profile");

const [passwords, setPasswords] = useState({
  current: "",
  new: "",
  confirm: "",
});

const [notifications, setNotifications] = useState({
  email: true,
  attendance: true,
  leave: true,
  payroll: true,
});

  return (
    <div className={styles.page}>
      
<div className={styles.card}>

<div className={styles.tabs}>
<div className={styles.avatar}>

{profile.profile_picture ? (

<img
src={`http://localhost:5000${profile.profile_picture}`}
alt="Profile"
className={styles.avatarImage}
/>

) : (

<span>👤</span>

)}

</div>

<button
className={activeTab==="security"?styles.activeTab:""}
onClick={()=>setActiveTab("security")}
>
🔒 Security
</button>

<button
className={activeTab==="notifications"?styles.activeTab:""}
onClick={()=>setActiveTab("notifications")}
>
🔔 Notifications
</button>

{role==="admin" && (

<button
className={activeTab==="company"?styles.activeTab:""}
onClick={()=>setActiveTab("company")}
>
🏢 Company
</button>

)}

</div>
        <div className={styles.form}>

          <div>
            <label>Full Name</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Address</label>
            <input
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Gender</label>

            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label>Position</label>
            <input
              name="position"
              value={profile.position}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Department</label>
            <input
              value={profile.department}
              readOnly
            />
          </div>

          <div>
            <label>Role</label>
            <input
              value={profile.role}
              readOnly
            />
          </div>

        </div>

        {activeTab==="security" && (

<>

<h2>🔒 Change Password</h2>

<div className={styles.form}>

<div>

<label>Current Password</label>

<input
type="password"
value={passwords.current}
onChange={(e)=>
setPasswords({
...passwords,
current:e.target.value
})
}
/>

</div>

<div>

<label>New Password</label>

<input
type="password"
value={passwords.new}
onChange={(e)=>
setPasswords({
...passwords,
new:e.target.value
})
}
/>

</div>

<div>

<label>Confirm Password</label>

<input
type="password"
value={passwords.confirm}
onChange={(e)=>
setPasswords({
...passwords,
confirm:e.target.value
})
}
/>

</div>

</div>

<button>
Update Password
</button>

</>

)}
{activeTab==="notifications" && (

<>

<h2>🔔 Notifications</h2>

<div className={styles.switchRow}>

<label>Email Notifications</label>

<input
type="checkbox"
checked={notifications.email}
onChange={()=>
setNotifications({
...notifications,
email:!notifications.email
})
}
/>

</div>

<div className={styles.switchRow}>

<label>Attendance Alerts</label>

<input
type="checkbox"
checked={notifications.attendance}
onChange={()=>
setNotifications({
...notifications,
attendance:!notifications.attendance
})
}
/>

</div>

<div className={styles.switchRow}>

<label>Leave Notifications</label>

<input
type="checkbox"
checked={notifications.leave}
onChange={()=>
setNotifications({
...notifications,
leave:!notifications.leave
})
}
/>

</div>

<div className={styles.switchRow}>

<label>Payroll Notifications</label>

<input
type="checkbox"
checked={notifications.payroll}
onChange={()=>
setNotifications({
...notifications,
payroll:!notifications.payroll
})
}
/>

</div>

</>

)}
{role==="admin" && activeTab==="company" && (

<>

<h2>🏢 Company Settings</h2>

<div className={styles.form}>

<div>

<label>Company Name</label>

<input placeholder="Staff-Flow Ltd"/>

</div>

<div>

<label>Working Hours</label>

<input placeholder="08:00 - 17:00"/>

</div>

<div>

<label>Annual Leave Days</label>

<input placeholder="24"/>

</div>

</div>

<button>

Save Company Settings

</button>

</>

)}
        <button onClick={handleSave}>
  Save Changes
</button>

      </div>
    </div>
  );
}