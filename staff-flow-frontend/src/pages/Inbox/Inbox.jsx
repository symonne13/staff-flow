import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./Inbox.module.css";

export default function Inbox() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/messages/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>

        <h2>Inbox</h2>

        {users.map((user) => (
          <div
            key={user.id}
            className={styles.user}
            onClick={() => setSelected(user)}
          >
            <h4>{user.name}</h4>

            <p>{user.department}</p>
          </div>
        ))}

      </div>

      <div className={styles.chat}>

        {selected ? (
          <>
            <h2>{selected.name}</h2>

            <p>Conversation coming next...</p>
          </>
        ) : (
          <h2>Select a user</h2>
        )}

      </div>
    </div>
  );
}