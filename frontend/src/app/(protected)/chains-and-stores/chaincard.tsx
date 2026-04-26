import { ChainCardProps, Store } from "../../../../models/interfaces";
import { useState } from "react";
import styles from "./ChainsAndStores.module.css";

export const ChainCard: React.FC<ChainCardProps> = ({ chain, stores, addStoreLocal }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const PlusMinusIcon: React.FC = () => {
    const d = isExpanded ? "M20 12H4" : "M12 4v16m8-8H4"; // Minus or Plus
    return (
      <svg
        className={styles.icon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={d}
        ></path>
      </svg>
    );
  };

  return (
    <div className={styles.chainCard}>
      {/* Header Row */}
      <div
        className={styles.cardHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.cardHeaderLeft}>
          {/* Logo Placeholder */}
          <div className={styles.logoPlaceholder}>
            <span>{chain.chain_name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <span className={styles.chainName}>{chain.chain_name}</span>
            {chain.url && (
              <a
                href={chain.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.chainUrl}
                onClick={(e) => e.stopPropagation()} // Prevent card expansion
              >
                Website
              </a>
            )}
          </div>
        </div>
        <PlusMinusIcon />
      </div>

      {/* Expanded Content (Stores List) */}
      {isExpanded && (
        <div className={styles.storeList}>
          <div className={`${styles.addStoreInput}`}>
          <input
            className={styles.formInput}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="store name"
          />
          <input
            className={styles.formInput}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            placeholder="store address"
          />
          <button
            className={`${styles.button} ${styles.submitButton}`}
            disabled={name == "" || address == ""}
            onClick={() => {
              addStoreLocal(chain.chain_id, name, address);
              setName("");
              setAddress("");
            }}
          >
            Add Store
          </button>
          </div>

          {stores && stores.length > 0 ? (
            <div>
              <h4 className={styles.storeListTitle}>
                Stores ({stores.length})
              </h4>
              {stores.map((store: Store, index) => (
                <div key={index} className={styles.storeItem}>
                  <div className={styles.storeAddress}>
                    name: {store.store_name} <br />
                    address: {store.store_address}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noStoresText}>
              No store locations added for this chain yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
};