"use client";

import React, { useState, useEffect } from "react";
import styles from "./ReviewReceiptsHistory.module.css";

import NavBar from "../../../../components/Navbar";
import { reviewHistory } from "@/app/api/shopper/review-history";
import { useAuth } from "react-oidc-context";
import { handleBuildComplete } from "next/dist/build/adapter/build-complete";

// --- TYPES ---

interface ReceiptItem {
    name: string;
    category: string;
    quantity: number;
    price: number;
}

// The API now returns the complete object, so we don't need separate "Api" vs "UI" types
interface Receipt {
    receipt_id: string;
    receipt_datetime: string;
    store_address: string; // Returned directly from backend join
    chain_name: string;
    totalPrice: number; // Calculated by backend
    items: ReceiptItem[];
}

const ReceiptCard = ({ receipt }: { receipt: Receipt }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString: string) => {
        if (!dateString || dateString.startsWith("0000")) return "Unknown Date";
        try {
            return new Date(dateString).toLocaleDateString("en-US");
        } catch {
            return dateString;
        }
    };

    const PlusIcon = () => (
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
                d="M12 4v16m8-8H4"
            />
        </svg>
    );

    const MinusIcon = () => (
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
                d="M20 12H4"
            />
        </svg>
    );

    return (
        <div className={styles.receiptCard}>
            {/* Header */}
            <div
                className={styles.cardHeader}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={styles.colStore}>{receipt.chain_name + " " + receipt.store_address}</div>
                <div className={styles.colDate}>
                    {formatDate(receipt.receipt_datetime)}
                </div>

                <div className={styles.colPrice}>${receipt.totalPrice.toFixed(2)}</div>

                <div>{isExpanded ? <MinusIcon /> : <PlusIcon />}</div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className={styles.expandedContent}>
                    <div className={styles.itemsTable}>
                        <div className={styles.tableHeader}>
                            <span className={styles.itemName}>Name</span>
                            <span className={styles.itemCategory}>Category</span>{" "}
                            <span className={styles.itemQty}>Qty</span>
                            <span className={styles.itemPrice}>Price</span>
                        </div>

                        {receipt.items && receipt.items.length > 0 ? (
                            receipt.items.map((item, idx) => (
                                <div key={idx} className={styles.itemRow}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemCategory}>{item.category}</span>
                                    <span className={styles.itemQty}>{item.quantity}</span>
                                    <span className={styles.itemPrice}>
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.itemRow}>
                                <span className={styles.itemName} style={{ color: "#6b7280" }}>
                                    No item details available.
                                </span>
                            </div>
                        )}

                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Total:</span>
                            <span className={styles.totalValue}>
                                ${receipt.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
export default function ReviewReceiptsHistory() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const auth = useAuth();
    const sub = auth.user?.profile.sub || "";

    useEffect(() => {
        async function fetchReceipts() {
            try {
                setIsLoading(true);
                // The Lambda now does the heavy lifting (JOINs), so we just fetch once.
                const data = await reviewHistory(sub);

                // Ensure data is typed correctly
                // Note: You might need to cast or validate data in a real app if API response is loose
                setReceipts(data as any as Receipt[]);
            } catch (error) {
                console.error("Failed to load receipts", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchReceipts();
    }, []);

    const handleCreateNewReceipt = () => {
        window.location.href = "/receipt-add";
    }

    return (
        <>
            <NavBar />
            <div className={styles.pageContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Past Receipts</h1>
                        <button
                            className={styles.createButton}
                            onClick={handleCreateNewReceipt}
                        >
                            Create New Receipt
                        </button>
                    </div>

                    {isLoading ? (
                        <div className={styles.loadingText}>Loading your history...</div>
                    ) : (
                        <div>
                            {receipts.length > 0 ? (
                                receipts.map((receipt) => (
                                    <ReceiptCard key={receipt.receipt_id} receipt={receipt} />
                                ))
                            ) : (
                                <div className={styles.loadingText}>No receipts found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
