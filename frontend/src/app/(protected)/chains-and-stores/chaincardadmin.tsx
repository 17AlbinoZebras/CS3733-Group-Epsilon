import {
  ChainCardAdminProps,
  Store,
  StoreAdmin,
} from "../../../../models/interfaces";
import styles from "./ChainsAndStores.module.css";
import { useState } from "react";

export const ChainCardAdmin: React.FC<ChainCardAdminProps> = ({
  chain,
  deleteChain,
  stores,
  deleteStore,
  addStoreLocal,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options can be used to round to whole numbers.
    trailingZeroDisplay: "stripIfInteger", // This is probably what most people
    // want. It will only stop printing
    // the fraction when the input
    // amount is a round number (int)
    // already. If that's not what you
    // need, have a look at the options
    // below.
    //minimumFractionDigits: 0, // This suffices for whole numbers, but will
    // print 2500.10 as $2,500.1
    //maximumFractionDigits: 0, // Causes 2500.99 to be printed as $2,501
  });

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
    <div className={`${styles.chainCard} ${chain.deleted && styles.deleted}`}>
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
            {chain.deleted ? (
              <span className={`${styles.chainUrl} ${styles.deletedText}`}>
                DELETED
              </span>
            ) : (
              <span></span>
            )}
          </div>
        </div>
        <div className={styles.chainSales}>
          {formatter.format(
            stores.reduce((sum, store: StoreAdmin) => sum + store.sales, 0)
          )}
        </div>
        {!chain.deleted && (
          <button
            onClick={() => {
              deleteChain(chain.chain_id);
            }}
            className={`${styles.button} ${styles.addChainButton}`}
          >
            DELETE
          </button>
        )}
        <PlusMinusIcon />
      </div>

      {/* Expanded Content (Stores List) */}
      {isExpanded && (
        <div className={styles.storeList}>
          {!chain.deleted && (
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
          )}
          {stores && stores.length > 0 ? (
            <div>
              <h4 className={styles.storeListTitle}>
                Stores (
                {
                  stores.filter((store: StoreAdmin) => store.deleted == 0)
                    .length
                }
                )
              </h4>
              {stores
                .filter((store: StoreAdmin) => store.deleted == 0)
                .map((store: StoreAdmin, index) => (
                  <div key={index} className={styles.storeItem}>
                    <div className={styles.storeAddress}>
                      name: {store.store_name} <br />
                      address: {store.store_address} <br />
                      sales: {formatter.format(store.sales)}
                    </div>
                    {!chain.deleted && (
                      <button
                        onClick={() => {
                          deleteStore(store.store_id, store.chain_id);
                        }}
                        className={`${styles.button} ${styles.addChainButton} ${styles.deleteButton}`}
                      >
                        delete store
                      </button>
                    )}
                  </div>
                ))}
              {stores
                .filter((store: StoreAdmin) => store.deleted == 1)
                .map((store: StoreAdmin, index) => (
                  <div key={index} className={styles.storeItem}>
                    <div className={styles.storeAddress}>
                      name: {store.store_name} <br />
                      address: {store.store_address} <br />
                      sales: {formatter.format(store.sales)}
                    </div>
                    <button
                      className={`${styles.button} ${styles.addChainButton} ${styles.deleteButton}`}
                      disabled={true}
                    >
                      deleted
                    </button>
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
