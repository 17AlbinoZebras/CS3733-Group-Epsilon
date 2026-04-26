import { CreateChainModalProps } from "../../../../models/interfaces";
import { useState } from "react";
import { createChain } from "@/app/api/shopper/create-chain";
import styles from './ChainsAndStores.module.css'
import { ChangeEvent } from "react";

export const CreateChainModal: React.FC<CreateChainModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
}) => {
  const [chainName, setChainName] = useState<string>("");
  const [chainUrl, setChainUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Return null if not visible (saves on rendering)
  if (!isVisible) return null;

  const handleSubmit = async () => {
    if (!chainName || !chainUrl)
      return alert("Chain Name and URL are required.");

    setIsSubmitting(true);
    try {
      const newChains = await createChain({ chainName, chainUrl });
      onSuccess(newChains);
      setChainName("");
      setChainUrl("");
      onClose();
    } catch (error) {
      console.error("Failed to create chain:", error);
      alert("Error adding chain.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Create Chain</h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="chainName">
            Chain Name <span className={styles.requiredStar}>*</span>
          </label>
          <input
            id="chainName"
            type="text"
            value={chainName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setChainName(e.target.value)
            }
            placeholder="e.g., Trader Joe's"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="chainUrl">
            Website URL <span className={styles.requiredStar}>*</span>
          </label>
          <input
            id="chainUrl"
            type="url"
            value={chainUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setChainUrl(e.target.value)
            }
            placeholder="https://example.com"
            className={styles.formInput}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            onClick={onClose}
            className={`${styles.button} ${styles.cancelButton}`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`${styles.button} ${styles.submitButton}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};