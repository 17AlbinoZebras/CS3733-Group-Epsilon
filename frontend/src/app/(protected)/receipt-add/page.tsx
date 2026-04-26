"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
// Import the CSS module
import styles from "./ReceiptAdd.module.css";
import { listChains } from "../../api/shopper/list-chains";
import NavBar from "../../../../components/Navbar";
import axios from "axios";
import { submitReceipt } from "@/app/api/shopper/submit-receipt";
import { useAuth } from "react-oidc-context";
import { listStores } from "@/app/api/shopper/list-stores";
import { v4 as uuidv4 } from "uuid";

// --- 1. TYPE DEFINITIONS ---

interface Store {
  chain_id: string;
  store_address: string;
  store_id: string;
  store_name: string;
}

interface Chain {
  chain_id: string;
  chain_name: string;
  url: string;
  stores: Store[];
}

export interface ReceiptItem {
  name: string;
  category: string;
  quantity: number;
  priceTotal: number;
  key: string;
}

interface ReceiptItemCardProps {
  receiptItem: ReceiptItem;
  removeItem: (key: string) => void;
  updateReceiptItems: (newItem: ReceiptItem) => void;
}

interface CreateReceiptItemProps {
  onSuccess: (newItem: ReceiptItem) => void;
}

interface CreateChainModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: (text: string) => void;
}

interface ChainsAndStoresDropdownProps {
  setIsLoading: (state: boolean) => void;
  setChainProp: (chain: Chain) => void;
  setStoreProp: (store: Store | undefined) => void;
  chains: Chain[];
  chain: Chain | undefined;
  store: Store | undefined;
}

interface DatePickerProps {
  onDateChange?: (sqlTimestamp: string) => void;
}

// --- 3. COMPONENTS ---

const ChainsAndStoresDropdown: React.FC<ChainsAndStoresDropdownProps> = ({
  setIsLoading,
  setChainProp,
  setStoreProp,
  chains,
  chain,
  store,
}) => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    async function fetchStores() {
      if (!chain) {
        setStores([]);
        setStoreProp(undefined);
        return;
      }
      setIsLoading(true);
      try {
        const allStores = await listStores(chain.chain_id);
        setStores(allStores);
        if (allStores.length > 0) {
          setStoreProp(allStores[0]); // select first store by default
        } else {
          setStoreProp(undefined);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        setStores([]);
        setStoreProp(undefined);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStores();
  }, [chain, setStoreProp, setIsLoading]);

  return (
    <div className={styles.formGroup}>
      <div className={styles.selectGroup}>
        <label className={styles.selectLabel} htmlFor="chainSelect">
          Chain <span className={styles.requiredStar}>*</span>
        </label>
        <select
          id="chainSelect"
          className={styles.selectInput}
          value={chain?.chain_id ?? ""}
          onChange={(e) => {
            const selected = chains.find((c) => c.chain_id === e.target.value);
            if (selected) setChainProp(selected);
          }}
        >
          <option value="">Select a chain</option>
          {chains.map((c) => (
            <option key={c.chain_id} value={c.chain_id}>
              {c.chain_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectGroup}>
        <label className={styles.selectLabel} htmlFor="storeSelect">
          Store <span className={styles.requiredStar}>*</span>
        </label>
        <select
          id="storeSelect"
          className={styles.selectInput}
          value={store?.store_id ?? ""}
          onChange={(e) => {
            const selected = stores.find((s) => s.store_id === e.target.value);
            setStoreProp(selected);
          }}
          disabled={stores.length === 0}
        >
          <option value="">Select a store</option>
          {stores.map((s) => (
            <option key={s.store_id} value={s.store_id}>
              {s.store_address}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
// Component: Receipt Item Card (final and editable)
const ReceiptItemCard: React.FC<ReceiptItemCardProps> = ({
  receiptItem,
  removeItem,
  updateReceiptItems,
}) => {
  const [receiptItemName, setReceiptItemName] = useState<string>(
    receiptItem.name
  );
  const [receiptItemCategory, setReceiptItemCategory] = useState<string>(
    receiptItem.category
  );
  const [receiptItemQuantity, setReceiptItemQuantity] = useState<string>(
    String(receiptItem.quantity)
  );
  const [receiptItemPrice, setReceiptItemPrice] = useState<string>(
    String(receiptItem.priceTotal)
  );
  const [editItem, setEditItem] = useState<boolean>(false);
  function isValidNumber(value: string): boolean {
    return /^\d+(\.\d+)?$/.test(value);
  }

  function isStrictInteger(value: string): boolean {
    return /^[0-9]+$/.test(value.trim());
  }

  const handleSubmit = () => {
    if (
      !receiptItemName ||
      !receiptItemCategory ||
      !receiptItemQuantity ||
      !receiptItemPrice
    ) {
      return alert("Information is required.");
    }
    if (!isValidNumber(receiptItemPrice)) {
      alert("Price must be a valid number.");
      return;
    }
    if (
      !isValidNumber(receiptItemQuantity) ||
      !isStrictInteger(receiptItemQuantity)
    ) {
      alert("Quantity must be an integer");
      return;
    }
    const newItem: ReceiptItem = {
      name: receiptItemName,
      category: receiptItemCategory,
      quantity: Number(receiptItemQuantity),
      priceTotal: Number(receiptItemPrice),
      key: receiptItem.key,
    };
    updateReceiptItems(newItem);
    setEditItem(false);
  };

  const MinusIcon: React.FC = () => {
    const d = "M20 12H4";
    return (
      <button onClick={() => removeItem(receiptItem.key)}>
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
      </button>
    );
  };

  const EditIcon: React.FC = () => {
    const d =
      "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";
    return (
      <button onClick={() => setEditItem(true)}>
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
      </button>
    );
  };

  return !editItem ? (
    <div className={styles.receiptItemCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div className={styles.receiptItemDetails}>
            <span className={styles.itemName}>Name: {receiptItem.name}</span>
            <span className={styles.itemCategory}>
              Category: {receiptItem.category}
            </span>
            <span className={styles.itemQuantity}>
              Quantity: {receiptItem.quantity}
            </span>
            <span className={styles.itemPrice}>
              Total Price: ${receiptItem.priceTotal}
            </span>
          </div>
        </div>
        <MinusIcon />
        <EditIcon />
      </div>
    </div>
  ) : (
    <div className={styles.receiptItemCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>

              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.formGroup}>
                    <div className={styles.formInputGroup}>
                      <label
                        className={styles.formLabel}
                        htmlFor="receiptItemName"
                      >
                        Item Name <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        id="receiptItemName"
                        type="text"
                        value={receiptItemName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReceiptItemName(e.target.value)
                        }
                        placeholder={receiptItem.name}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formInputGroup}>
                      {" "}
                      <label
                        className={styles.formLabel}
                        htmlFor="receiptItemCategory"
                      >
                        Item Category{" "}
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        id="receiptItemCategory"
                        type="text"
                        value={receiptItemCategory}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReceiptItemCategory(e.target.value)
                        }
                        placeholder={receiptItem.category}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formInputGroup}>
                      {" "}
                      <label
                        className={styles.formLabel}
                        htmlFor="receiptItemQuantity"
                      >
                        Quantity <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        id="receiptItemQuantity"
                        type="text"
                        value={receiptItemQuantity}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReceiptItemQuantity(e.target.value)
                        }
                        placeholder={String(receiptItem.quantity)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formInputGroup}>
                      {" "}
                      <label
                        className={styles.formLabel}
                        htmlFor="receiptItemPrice"
                      >
                        Total Price{" "}
                        <span className={styles.requiredStar}>*</span>
                      </label>
                      <input
                        id="receiptItemPrice"
                        type="text"
                        value={receiptItemPrice}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setReceiptItemPrice(e.target.value)
                        }
                        placeholder={String(receiptItem.priceTotal)}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.editFormActions}>
                      <MinusIcon />
                      <button
                        onClick={handleSubmit}
                        className={`${styles.button} ${styles.submitButton}`}
                      >
                        Update Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
};

// Component: Create Receipt Item
const CreateReceiptItem: React.FC<CreateReceiptItemProps> = ({ onSuccess }) => {
  const [receiptItemName, setReceiptItemName] = useState<string>("");
  const [receiptItemCategory, setReceiptItemCategory] = useState<string>("");
  const [receiptItemQuantity, setReceiptItemQuantity] = useState<string>("0");
  const [receiptItemPrice, setReceiptItemPrice] = useState<string>("0");

  function isValidNumber(value: string): boolean {
    return /^\d+(\.\d+)?$/.test(value);
  }

  function isStrictInteger(value: string): boolean {
    return /^[0-9]+$/.test(value.trim());
  }

  const handleSubmit = () => {
    if (
      !receiptItemName ||
      !receiptItemCategory ||
      !receiptItemQuantity ||
      !receiptItemPrice
    ) {
      return alert("Information is required.");
    }
    if (!isValidNumber(receiptItemPrice)) {
      alert("Price must be a valid number.");
      return;
    }
    if (
      !isValidNumber(receiptItemQuantity) ||
      !isStrictInteger(receiptItemQuantity)
    ) {
      alert("Quantity must be an integer");
      return;
    }
    const newItem: ReceiptItem = {
      name: receiptItemName,
      category: receiptItemCategory,
      quantity: Number(receiptItemQuantity),
      priceTotal: Number(receiptItemPrice),
      key: uuidv4(),
    };
    onSuccess(newItem);
    setReceiptItemName("");
    setReceiptItemCategory("");
    setReceiptItemQuantity("0");
    setReceiptItemPrice("0");
  };

  return (
    <div className={styles.receiptItemCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          <div className={styles.formGroup}>
            <div className={styles.formInputGroup}>
              <label className={styles.formLabel} htmlFor="receiptItemName">
                Item Name <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="receiptItemName"
                type="text"
                value={receiptItemName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReceiptItemName(e.target.value)
                }
                placeholder="e.g., Fairlife 2% Milk"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formInputGroup}>
              <label className={styles.formLabel} htmlFor="receiptItemCategory">
                Item Category <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="receiptItemCategory"
                type="text"
                value={receiptItemCategory}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReceiptItemCategory(e.target.value)
                }
                placeholder="Milk"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formInputGroup}>
              <label className={styles.formLabel} htmlFor="receiptItemQuantity">
                Item Quantity <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="receiptItemQuantity"
                type="text"
                value={receiptItemQuantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReceiptItemQuantity(e.target.value)
                }
                placeholder="0"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formInputGroup}>
              <label className={styles.formLabel} htmlFor="receiptItemPrice">
                Total Price <span className={styles.requiredStar}>*</span>
              </label>
              <input
                id="receiptItemPrice"
                type="number"
                value={receiptItemPrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setReceiptItemPrice(e.target.value)
                }
                min={0}
                placeholder="0"
                className={styles.formInput}
              />
            </div>
            <button
              onClick={handleSubmit}
              className={`${styles.button} ${styles.submitButton}`}
              disabled={
                !receiptItemCategory ||
                !receiptItemName ||
                !receiptItemPrice ||
                !receiptItemQuantity
              }
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Create Chain Modal
const CreateChainModal: React.FC<CreateChainModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
}) => {
  const [openAIKey, setKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // Return null if not visible (saves on rendering)
  if (!isVisible) return null;

  const handleSubmit = async () => {
    const prompt =
      'Extract all text from this image. Using the following definitions interface Store {store_address: string} interface Chain {chain_name: string;} (please include store and chain objects that have the objects store_address and chain_name objects respectively) (store_address should be in the format of 123 street name, city, state but acronym (so CA for California) and zip and country, all separated by commas, if not all information is there just put exactly whatever is there as the address) interface ReceiptItem {name: string;category: string;quantity: number;priceTotal: number;key: string;}. For name, use the exact brand name and product name as it appears on the receipt. For category, use the SIMPLEST, most basic name of what the item actually is. ALWAYS provide a category - do not leave it blank unless you truly cannot identify what the item is. Examples: "Big Guy Broccoli" name=Big Guy Broccoli, category=broccoli; "Fairlife Chocolate Milk" name=Fairlife Chocolate Milk, category=milk; "Dozen Farm Fresh Eggs" name=Dozen Farm Fresh Eggs, category=eggs; "Granny Smith Apples" name=Granny Smith Apples, category=apple; "Lay\'s Potato Chips" name=Lay\'s Potato Chips, category=chips; "Coca Cola" name=Coca Cola, category=soda; "Ground Beef 80/20" name=Ground Beef 80/20, category=beef; "Chicken Breast" name=Chicken Breast, category=chicken; "Wonder Bread" name=Wonder Bread, category=bread; "Sriracha Sauce" name=Sriracha Sauce, category=sauce; "Hoisin Sauce" name=Hoisin Sauce, category=sauce; "Oyster Sauce" name=Oyster Sauce, category=sauce; "Soy Sauce" name=Soy Sauce, category=sauce; "Avocado Oil" name=Avocado Oil, category=oil; "Sesame Oil" name=Sesame Oil, category=oil; "Olive Oil" name=Olive Oil, category=oil; "Ground Peppercorn" name=Ground Peppercorn, category=pepper; "Sea Salt" name=Sea Salt, category=salt; "Sweetarts" name=Sweetarts, category=candy; "Sushi Chef Rice Vinegar" name=Sushi Chef Rice Vinegar, category=vinegar; "Sushi Chef Seaweed" name=Sushi Chef Seaweed, category=seaweed. The category should be the specific item type (milk, apple, broccoli, chicken, beef, bread, chips, soda, sauce, oil, salt, pepper, candy, vinegar, etc.). IMPORTANT: For sauces, the category is "sauce". For oils, the category is "oil". For seasonings like salt and pepper, use "salt" or "pepper". For candy/sweets, use "candy". Only leave category as empty string "" if the item is completely unidentifiable. Please write the receipt with the chain, the store, and the receipt_items, separated by new lines in json format so i can easily parse the data into an object easily using the interface definitions above. Each receipt item should have the name, category, quantity, and price, but no key. The name and category should be in standard English, and the price should be in dollars with cents. Do not put header text saying "here is the text" just the information. Do not number the items. if there is no specific address for store or no specific name for chain, leave it blank but still leave store: or chain: and store_address and chain_name but blank, respectively. do not put markdown elements like ```json';
    setIsSubmitting(true);
    if (!openAIKey) {
      setIsSubmitting(false);
      return alert("OpenAI API Key required.");
    }
    if (!file) {
      setIsSubmitting(false);
      return alert("file required.");
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];

        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: { url: `data:${file.type};base64,${base64}` },
                  },
                ],
              },
            ],
            temperature: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${openAIKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data.choices[0].message.content);
        onSuccess(response.data.choices[0].message.content);
      } catch (error) {
        console.error("Error extracting text:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Scan Receipt</h2>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="chainName">
            OpenAI API Key <span className={styles.requiredStar}>*</span>
          </label>
          <input
            id="chainName"
            type="text"
            value={openAIKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setKey(e.target.value)
            }
            placeholder="Your Key Here"
            className={styles.formInput}
          />
        </div>
        <input
          type="file"
          accept="image/jpg, image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
        />
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
            {isSubmitting ? "Scanning..." : "Scan"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);

    const sqlTimestamp = dateToSQLTimestamp(newDate);

    if (onDateChange) {
      onDateChange(sqlTimestamp);
    }
  };

  const dateToSQLTimestamp = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${year}-${month}-${day} 00:00:00`;
  };

  return (
    <div className={styles.selectGroup}>
      <label htmlFor="receiptDate" className={styles.selectLabel}>
        Receipt Date <span className={styles.requiredStar}>*</span>
      </label>
      <input
        id="receiptDate"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        max={today}
        className={styles.selectInput}
      />
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
export default function ReceiptItems() {
  const [itemsAll, setItems] = useState<ReceiptItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedChain, setSelectedChain] = useState<Chain>();
  const [selectedStore, setSelectedStore] = useState<Store>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shopperID, setShopperID] = useState<string>("");
  const [chains, setChains] = useState<Chain[]>([]);
  const [receipt_datetime, setDate] = useState<string>("");
  const { user, isLoading: authLoading } = useAuth();

  const handleChainCreated = (newReceiptItem: ReceiptItem) => {
    setItems((prev) => [...prev, newReceiptItem]);
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateReceiptItems = (updatedItem: ReceiptItem) => {
    setItems((prev) =>
      prev.map((item) => (item.key === updatedItem.key ? updatedItem : item))
    );
  };

  useEffect(() => {
    async function getAuthTokenAndChains() {
      setIsLoading(true);
      try {
        let tok = user?.profile.sub;
        if (tok) {
          console.log(tok);
          setShopperID(tok);
        }
        let newChains = [];
        newChains = await listChains();
        setChains(newChains);
        setSelectedChain(newChains[0]);
      } catch (error) {
        console.error("Error fetching token and chains:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getAuthTokenAndChains();
  }, []);

  const handleScanned = async (text: string) => {
    const jsonData = JSON.parse(text);
    setItems([]);
    let newItems: ReceiptItem[] = [];
    for (const item of jsonData.receipt_items) {
      const temp: ReceiptItem = { ...item, key: uuidv4() };
      newItems.push(temp);
    }

    let getChain;
    let getStore;
    setSelectedChain(
      (getChain = chains.find(
        (chain) =>
          chain.chain_name
            .trim()
            .toLowerCase()
            .replace(",", "")
            .replace(" ", "") ===
          jsonData.chain.chain_name
            .trim()
            .toLowerCase()
            .replace(",", "")
            .replace(" ", "")
      ))
    );

    if (!getChain) {
      console.log("ALLERERRRT CHAIN");
      alert("Please create the Chain, it does not exist.");
    }

    if (getChain) {
      setIsLoading(true);
      try {
        const allStores: Store[] = await listStores(getChain.chain_id);
        setSelectedStore(
          (getStore = allStores.find(
            (store) =>
              store.store_address
                .trim()
                .toLowerCase()
                .replace(",", "")
                .replace(" ", "") ===
              jsonData.store.store_address
                .trim()
                .toLowerCase()
                .replace(",", "")
                .replace(" ", "")
          ))
        );
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("ALLERERRRT STORE");
      setSelectedStore(undefined);
    }

    if (!getStore) {
      alert("Please create the Store, it does not exist");
    }

    setItems(newItems);
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedChain) return alert("Chain is required.");
    if (!selectedStore) return alert("Store is required.");
    if (!itemsAll || itemsAll.length === 0) return alert("Items are required.");

    setIsSubmitting(true);
    try {
      const store_id = selectedStore.store_id;
      const shopper_id = shopperID;

      if (store_id) {
        const items: ReceiptItem[] = itemsAll.map((item) => ({
          ...item,
          priceTotal: item.priceTotal / item.quantity,
        }));
        console.log(receipt_datetime);
        await submitReceipt({ items, store_id, shopper_id, receipt_datetime });
      }

      setSelectedChain(chains[0] ?? undefined);
      setSelectedStore(undefined);
      setItems([]);
      window.location.href = "/review-receipts-history";
    } catch (error) {
      console.error("Failed to create receipt:", error);
      alert("Error submitting receipt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <br />
      <ChainsAndStoresDropdown
        setIsLoading={setIsLoading}
        setChainProp={setSelectedChain}
        setStoreProp={setSelectedStore}
        chains={chains}
        chain={selectedChain}
        store={selectedStore}
      />
      <DatePicker onDateChange={setDate} />
      {isLoading || authLoading ? (
        <div className={styles.loadingText}>Loading chains and token...</div>
      ) : (
        <>
          <div className={styles.pageContainer}>
            <div className={styles.contentWrapper}>
              <div className={styles.header}>
                <h1 className={styles.title}>Create Receipt</h1>
                <div className={styles.actionsContainer}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={`${styles.button} ${styles.addChainButton}`}
                  >
                    Scan Receipt
                  </button>
                </div>
              </div>

              <div className={styles.receiptItemListContainer}>
                {itemsAll.map((item, index) => (
                  <React.Fragment key={`${item.name}-${index}`}>
                    <ReceiptItemCard
                      key={`${item.name}-${index}`}
                      receiptItem={item}
                      removeItem={removeItem}
                      updateReceiptItems={updateReceiptItems}
                    />
                    <br />
                  </React.Fragment>
                ))}
              </div>
              <CreateReceiptItem onSuccess={handleChainCreated} />
              <div className={styles.buttonContainer}>
                <button
                  onClick={handleSubmit}
                  className={`${styles.button} ${styles.submitButton}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
          <CreateChainModal
            isVisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleScanned}
          />
        </>
      )}
    </>
  );
}
