import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import styles from "./AdminLeave.module.css";

export default function AdminLeave() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // ======================
  // LOAD LEAVES
  // ======================

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const res = await api.get("/leave/all");

      setLeaves(res.data.requests || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();

    const interval = setInterval(loadLeaves, 5000);

    return () => clearInterval(interval);
  }, []);

  // ======================
  // FILTER SEARCH
  // ======================

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      return (
        leave.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        leave.department
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        leave.leave_type
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [search, leaves]);

  // ======================
  // SUMMARY
  // ======================

  const summary = useMemo(() => {
    return {
      pending: filteredLeaves.filter(
        (l) => l.status === "PENDING"
      ).length,

      approved: filteredLeaves.filter(
        (l) => l.status === "APPROVED"
      ).length,

      rejected: filteredLeaves.filter(
        (l) => l.status === "REJECTED"
      ).length,
    };
  }, [filteredLeaves]);

  // ======================
  // APPROVE
  // ======================

  const approveLeave = async (id) => {
    try {
      const res = await api.put(`/leave/approve/${id}`);

      alert(res.data.message);

      loadLeaves();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ======================
  // OPEN REJECT
  // ======================

  const openReject = (leave) => {
    setSelectedLeave(leave);
    setRejectReason("");
  };

  // ======================
  // SEND REJECTION
  // ======================

  const rejectLeave = async () => {
    if (!rejectReason.trim()) {
      return alert("Enter rejection reason");
    }

    try {
      const res = await api.put(
        `/leave/reject/${selectedLeave.id}`,
        {
          rejection_reason: rejectReason,
        }
      );

      alert(res.data.message);

      setSelectedLeave(null);

      loadLeaves();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ======================
  // DELETE
  // ======================

  const deleteLeave = async (id) => {
    if (!window.confirm("Delete leave request?"))
      return;

    try {
      const res = await api.delete(`/leave/${id}`);

      alert(res.data.message);

      loadLeaves();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ======================
  // ON LEAVE
  // ======================
const startLeave = async (id) => {
  try {
    const res = await api.put(`/leave/start/${id}`);

    alert(res.data.message);

    loadLeaves();
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};
  

  // ======================
  // RETURN TO WORK
  // ======================
const returnToWork = async (id) => {
  try {
    const res = await api.put(`/leave/return/${id}`);

    alert(res.data.message);

    loadLeaves();
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};
  return (
    <div className={styles.container}>
          <h1 className={styles.title}>Leave Management</h1>

      // =======================
     //  SUMMARY CARDS
    //======================== 

      <div className={styles.summaryGrid}>

        <div className={styles.summaryCard}>
          <h2>{summary.pending}</h2>
          <p>Pending Requests</p>
        </div>

        <div className={styles.summaryCard}>
          <h2>{summary.approved}</h2>
          <p>Approved Leaves</p>
        </div>

        <div className={styles.summaryCard}>
          <h2>{summary.rejected}</h2>
          <p>Rejected Leaves</p>
        </div>

      </div>

      {/* =======================
            SEARCH
      ======================== */}

      <input
        className={styles.search}
        placeholder="Search employee, department or leave type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* =======================
          PENDING REQUESTS
      ======================== */}
<div>
      <h2 className={styles.sectionTitle}>
        Pending Requests
      </h2>

      <div className={styles.grid}>

        {filteredLeaves
          .filter((leave) => leave.status === "PENDING")
          .map((leave) => (

            <div
              key={leave.id}
              className={styles.card}
            >

              <h3>{leave.name}</h3>

              <p>
                <strong>Department:</strong>{" "}
                {leave.department}
              </p>

              <p>
                <strong>Position:</strong>{" "}
                {leave.position}
              </p>

              <p>
                <strong>Leave Type:</strong>{" "}
                {leave.leave_type}
              </p>

              <p>
                <strong>Leave Balance:</strong>{" "}
                {leave.annual_leave_balance} Days
              </p>

              <p>
                <strong>From:</strong>{" "}
                {new Date(
                  leave.date_from
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {new Date(
                  leave.date_to
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Total Days:</strong>{" "}
                {leave.total_days}
              </p>

              <p>
                <strong>Reason</strong>
              </p>

              <div className={styles.reason}>
                {leave.reason}
              </div>

              <button
                className={styles.pendingBtn}
              >
                Pending
              </button>

              <div className={styles.actions}>

                <button
                  className={styles.approveBtn}
                  onClick={() =>
                    approveLeave(leave.id)
                  }
                >
                  Approve
                </button>

                <button
                  className={styles.rejectBtn}
                  onClick={() =>
                    openReject(leave)
                  }
                >
                  Reject
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() =>
                    deleteLeave(leave.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

        ))}

      </div>
      </div>
            {/* =======================
          APPROVED LEAVES
      ======================== */}
<div>
      <h2 className={styles.sectionTitle}>
        Approved Leaves
      </h2>

      <div className={styles.grid}>

        {filteredLeaves
          .filter((leave) => leave.status === "APPROVED")
          .map((leave) => (

            <div
              key={leave.id}
              className={styles.card}
            >

              <h3>{leave.name}</h3>

              <p>
                <strong>Department:</strong>{" "}
                {leave.department}
              </p>

              <p>
                <strong>Position:</strong>{" "}
                {leave.position}
              </p>

              <p>
                <strong>Leave Type:</strong>{" "}
                {leave.leave_type}
              </p>

              <p>
                <strong>Total Days:</strong>{" "}
                {leave.total_days}
              </p>

              <p>
                <strong>From:</strong>{" "}
                {new Date(
                  leave.date_from
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {new Date(
                  leave.date_to
                ).toLocaleDateString()}
              </p>

              <button
                className={styles.approvedBtn}
              >
                Approved
              </button>

              <div className={styles.actions}>

                {/* Admin starts leave */}
                <button
                  className={styles.onLeaveBtn}
                  onClick={() =>
                    startLeave(leave.id)
                  }
                >
                  On Leave
                </button>

                {/* Employee returns */}
                <button
                  className={styles.returnBtn}
                  onClick={() =>
                    returnToWork(leave.id)
                  }
                >
                  Return To Work
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() =>
                    deleteLeave(leave.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

        ))}

      </div>
      </div>

      {/* =======================
          REJECTED LEAVES
      ======================== */}
<div>
      <h2 className={styles.sectionTitle}>
        Rejected Leaves
      </h2>

      <div className={styles.grid}>

        {filteredLeaves
          .filter((leave) => leave.status === "REJECTED")
          .map((leave) => (

            <div
              key={leave.id}
              className={styles.card}
            >

              <h3>{leave.name}</h3>

              <p>
                <strong>Department:</strong>{" "}
                {leave.department}
              </p>

              <p>
                <strong>Position:</strong>{" "}
                {leave.position}
              </p>

              <p>
                <strong>Leave Type:</strong>{" "}
                {leave.leave_type}
              </p>

              <p>
                <strong>From:</strong>{" "}
                {new Date(
                  leave.date_from
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {new Date(
                  leave.date_to
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Reason</strong>
              </p>

              <div className={styles.reason}>
                {leave.reason}
              </div>

              <p>
                <strong>Rejected Because</strong>
              </p>

              <div className={styles.rejectReason}>
                {leave.rejection_reason || "No reason provided"}
              </div>

              <button
                className={styles.rejectedBtn}
              >
                Rejected
              </button>

              <div className={styles.actions}>

                <button
                  className={styles.deleteBtn}
                  onClick={() =>
                    deleteLeave(leave.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

        ))}

      </div>
    </div>
            {/* ======================
            NO RECORDS
      ====================== */}

      {!loading && filteredLeaves.length === 0 && (
        <div className={styles.empty}>
          <h3>No leave requests found.</h3>
        </div>
      )}

      {/* ======================
            LOADING
      ====================== */}

      {loading && (
        <div className={styles.loading}>
          Loading leave requests...
        </div>
      )}

      {/* ======================
            REJECT MODAL
      ====================== */}

      {selectedLeave && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h2>Reject Leave Request</h2>

            <p>
              <strong>{selectedLeave.name}</strong>
            </p>

            <textarea
              className={styles.textarea}
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) =>
                setRejectReason(e.target.value)
              }
            />

            <div className={styles.modalButtons}>

              <button
                className={styles.sendBtn}
                onClick={rejectLeave}
              >
                Send Rejection
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setSelectedLeave(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          </div>
      )}
        </div>
      );
        }