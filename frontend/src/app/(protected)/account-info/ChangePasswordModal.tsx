import React, { useState } from "react";
import styles from "./AccountInfo.module.css";
// Adjust this import path to where you saved the API function you provided
import { changePassword } from "../../api/shopper/change-password";
import { useAuth } from "react-oidc-context";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const accessToken = auth.user?.access_token || "";
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // Call the API function you provided
      const [status, message] = await changePassword(
        accessToken,
        currentPassword,
        newPassword
      );

      if (status === 200) {
        alert("Password changed successfully!");
        onClose();
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(String(message));
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Change Password</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Current Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showCurrent ? "text" : "password"}
              className={styles.formInput}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowCurrent(!showCurrent)} // Changed setter
            >
              {showCurrent ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>New Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showNew ? "text" : "password"}
              className={styles.formInput}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowNew(!showNew)} // Changed setter
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Confirm New Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              className={styles.formInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirm(!showConfirm)} // Changed setter
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
