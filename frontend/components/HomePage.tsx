"use client";

import Link from "next/link";
import { useAuth } from "react-oidc-context";
import InfoBar from "../models/navbar"; // Check your path ensures this is correct
import NavBar from "./Navbar"; // Check your path ensures this is correct
import styles from "./HomePage.module.css";

export default function HomePage() {
  const auth = useAuth();

  return (
    <div>
      <NavBar />
      {auth.user && 
      <div className={styles["dashboard-container"]}>
        <div className={styles["dashboard-content"]}>
          <header className={styles["dashboard-header"]}>
            <h1>Welcome back, {String(auth.user!.profile['cognito:username'])}</h1>
            <p>What would you like to do today?</p>
          </header>

          <div className={styles["dashboard-grid"]}>
            {/* Link 1: Chains & Stores */}
            <Link href="/chains-and-stores" className={styles["dashboard-card"]}>
              <div className={styles.icon}>🏪</div>
              <h3>Chains & Stores</h3>
              <p>Manage store locations and view chain details.</p>
            </Link>

            {/* Link 2: Receipt Add */}
            <Link href="/receipt-add" className={styles["dashboard-card"]}>
              <div className={styles.icon}>🧾</div>
              <h3>Add Receipt</h3>
              <p>Upload a new receipt or scan with AI.</p>
            </Link>

            {/* Link 3: Search Recent Purchases */}
            <Link href="/search-recent-purchases" className={styles["dashboard-card"]}>
              <div className={styles.icon}>🔍</div>
              <h3>Search Purchases</h3>
              <p>Find items and prices from your history.</p>
            </Link>
          </div>
        </div>
      </div>
}
    </div>
  );
}
