"use client";

import React, { useState, useEffect } from "react";
// Ensure this path matches your file structure location
import styles from "./SearchRecentPurchases.module.css";
import NavBar from "../../../../components/Navbar";
import { useAuth } from "react-oidc-context";
import {
  searchPurchases,
  SearchResultItem,
} from "@/app/api/shopper/search-purchases";

export default function SearchRecentPurchases() {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to perform the fetch
  const performSearch = async (searchTerm: string) => {
    setIsLoading(true);

    // Use logged-in user's ID or fallback
    const shopperID = auth.user?.profile.sub || "test-shopper-id";

    // If searchTerm is empty, backend should return "all" (matches wildcard %%)
    const data = await searchPurchases(shopperID, searchTerm);

    setResults(data);
    setIsLoading(false);
  };

  // 1. Load ALL items on initial page load
  useEffect(() => {
    performSearch("");
  }, [auth.user]); // Re-run if user logs in/out

  // 2. Handle manual search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <>
      <NavBar />
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>Search Purchases</h1>
          </div>

          {/* Search Bar */}
          <form className={styles.searchContainer} onSubmit={handleSearch}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for items (e.g., 'Milk', 'Eggs')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className={styles.searchButton}
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Results Area */}
          <div className={styles.resultsList}>
            {isLoading ? (
              <div key={'loading-results'} className={styles.emptyState}>Loading your purchases...</div>
            ) : results.length === 0 ? (
              <div key={'no-results'} className={styles.emptyState}>No purchases found.</div>
            ) : (
              results.map((item:SearchResultItem, index: number) => (
                <div key={`${item.receipt_item_id}-${index}`} className={styles.resultCard}>
                  {/* Left: Item Details */}
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.item_name}</div>
                    <div className={styles.itemContext}>
                      {item.chain_name} — {item.store_address}
                    </div>
                    <div>
                      <span className={styles.dateBadge}>
                        {new Date(item['receipt_datetime']).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Price Details */}
                  <div className={styles.priceInfo}>
                    <div className={styles.totalPrice}>
                      ${(item['item_quantity'] * item.unit_price).toFixed(2)}
                    </div>
                    <div className={styles.unitPrice}>
                      {item['item_quantity']} x ${item.unit_price.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
