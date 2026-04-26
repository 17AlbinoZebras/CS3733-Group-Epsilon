"use client";

import { useState, useEffect } from "react";
import styles from "./ChainsAndStores.module.css";
import { listChains } from "../../api/shopper/list-chains";
import NavBar from "../../../../components/Navbar";
import { useAuth } from "react-oidc-context";
import { useUserRoles } from "../../../../hooks/useRoles";
import { adminChains } from "@/app/api/admin/admin-chains";
import {
  Chain,
  ChainAdmin,
  Store,
  StoreAdmin,
} from "../../../../models/interfaces";
import { removeChain } from "@/app/api/admin/remove-chain";
import { listAllStores } from "@/app/api/shopper/list-all-stores";
import { ChainCard } from "./chaincard";
import { CreateChainModal } from "./chainmodal";
import { ChainCardAdmin } from "./chaincardadmin";
import { addStore } from "@/app/api/shopper/add-store";
import { removeStore } from "@/app/api/admin/remove-store";
import { adminStores } from "@/app/api/admin/admin-store";

// --- 4. MAIN COMPONENT ---
export default function ChainsAndStores() {
  const auth = useAuth();
  const [chains, setChains] = useState<Chain[] | ChainAdmin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [stores, setStores] = useState<Store[] | StoreAdmin[]>([]);
  const { isAdmin, groups } = useUserRoles();

  useEffect(() => {
    async function getChainsAndStores() {
      setIsLoading(true);
      try {
        let newChains = [];
        if (!isAdmin) newChains = await listChains();
        else newChains = await adminChains();
        setChains(newChains);
      } catch (error) {
        console.error("Error fetching chains:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getChainsAndStores();

    if (isAdmin) {
      getAllAdminStores();
    } else {
      getAllStores();
    }
  }, []);

  const deleteChain = async (chainID: string) => {
    let newChains = await removeChain(chainID);
    setChains(newChains);
  };

  const deleteStore = async (storeID: string, chainID: string) => {
    let newStores = await removeStore(storeID, chainID);
    updateStores(newStores, chainID);
  };

  const getAllStores = async () => {
    let allStores: Store[] = await listAllStores();
    setStores(allStores);
  };

  const getAllAdminStores = async () => {
    let allStoresAdmin: StoreAdmin[] = await adminStores();
    setStores(allStoresAdmin);
  };

  const handleChainCreated = (newChains: Chain[]) => {
    setChains((prevChains) => {
      console.log(newChains);
      return newChains;
    });
  };

  const addStoreLocal = async (
    chainID: string,
    name: string,
    address: string
  ) => {
    let newStores = await addStore(chainID, name, address);
    updateStores(newStores, chainID);
  };

  const updateStores = (newStores: Store[], chainID: string) => {
    let oldStores = [...stores].filter((e: Store) => e.chain_id != chainID);
    let allStores = [...oldStores, ...newStores];
    setStores(allStores);
  };

  return (
    <>
      <NavBar />
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* Header and Action Buttons */}
          <div className={styles.header}>
            <h1 className={styles.title}>Chains & Stores</h1>
            <div className={styles.actionsContainer}>
              <button
                onClick={() => setIsModalOpen(true)}
                className={`${styles.button} ${styles.addChainButton}`}
              >
                Add Chain
              </button>
            </div>
          </div>

          {/* Chain List */}
          {isLoading ? (
            <div className={styles.loadingText}>Loading chains...</div>
          ) : !isAdmin ? (
            <div className={styles.chainListContainer}>
              {chains
                .map((chain: Chain) => (
                  <ChainCard
                    key={chain["chain_id"]}
                    chain={chain}
                    stores={stores.filter(
                      (store: Store) => store.chain_id == chain.chain_id
                    )}
                    addStoreLocal={addStoreLocal}
                  />
                ))}
            </div>
          ) : (
            <div className={styles.chainListContainer}>
              You are Admin
              {(chains as ChainAdmin[])
                .filter((chain: Chain) => chain.deleted == 0)
                .map((chain) => (
                  <ChainCardAdmin
                    key={chain["chain_id"]}
                    chain={chain}
                    deleteChain={deleteChain}
                    deleteStore={deleteStore}
                    stores={(stores as StoreAdmin[]).filter(
                      (store: StoreAdmin) => store.chain_id == chain.chain_id
                    )}
                    addStoreLocal={addStoreLocal}
                  />
                ))}
 
              {(chains as ChainAdmin[]).filter((chain:Chain) => chain.deleted == 1).map((chain) => (
                <ChainCardAdmin key={chain["chain_id"]} chain={chain} deleteChain={deleteChain} deleteStore={deleteStore} stores={(stores as StoreAdmin[]).filter((store:Store) => store.chain_id == chain.chain_id)} addStoreLocal={addStoreLocal} />
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <CreateChainModal
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleChainCreated}
        />
      </div>
    </>
  );
}
