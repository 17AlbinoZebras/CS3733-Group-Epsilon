"use client";

import React, { useEffect, useState } from "react";
import styles from "./AccountInfo.module.css";
import NavBar from "../../../../components/Navbar";
import { useAuth } from "react-oidc-context";
import ChangePasswordModal from "./ChangePasswordModal";
import { reviewActivity } from "@/app/api/shopper/review-activity";

interface ActivityItem {
    period: string;
    sort_date: string;
    total_spent: number;
}

// Simple SVG Component for the Avatar silhouette
const AvatarIcon = () => (
    <svg viewBox="0 0 24 24" fill="#f43f5e" className={styles.avatarSvg}>
        <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
        />
    </svg>
);

// Format period for display
const formatPeriodDisplay = (period: string, periodType: string): string => {
    if (periodType === "day") {
        const date = new Date(period);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } else if (periodType === "week") {
        // Format: 2024-W48 -> Week 48, 2024
        const match = period.match(/(\d{4})-W(\d{2})/);
        if (match) {
            return `Week ${parseInt(match[2])}, ${match[1]}`;
        }
        return period;
    } else if (periodType === "month") {
        const [year, month] = period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    }
    return period;
};

// Helper function to get week number from date
const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

// Fill gaps in activity data
const fillActivityGaps = (activity: ActivityItem[], periodType: string): ActivityItem[] => {
    if (activity.length === 0) return [];
    
    // For daily, just return as-is (no gap filling)
    if (periodType === "day") {
        return activity;
    }
    
    const filled: ActivityItem[] = [];
    const firstDate = new Date(activity[0].sort_date);
    const lastDate = new Date(activity[activity.length - 1].sort_date);
    
    // Create a map of existing periods for quick lookup
    const existingPeriods = new Map(activity.map(item => [item.period, item]));
    
    if (periodType === "week") {
        let current = new Date(firstDate);
        // Move to Monday of the week
        const day = current.getDay();
        const diff = current.getDate() - day + (day === 0 ? -6 : 1);
        current.setDate(diff);
        
        while (current <= lastDate) {
            const year = current.getFullYear();
            const week = getWeekNumber(current);
            const periodKey = `${year}-W${week.toString().padStart(2, '0')}`;
            
            if (existingPeriods.has(periodKey)) {
                filled.push(existingPeriods.get(periodKey)!);
            } else {
                filled.push({
                    period: periodKey,
                    sort_date: current.toISOString(),
                    total_spent: 0
                });
            }
            current.setDate(current.getDate() + 7);
        }
    } else if (periodType === "month") {
        let current = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        const lastMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
        
        while (current <= lastMonth) {
            const periodKey = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
            if (existingPeriods.has(periodKey)) {
                filled.push(existingPeriods.get(periodKey)!);
            } else {
                filled.push({
                    period: periodKey,
                    sort_date: current.toISOString(),
                    total_spent: 0
                });
            }
            current.setMonth(current.getMonth() + 1);
        }
    }
    
    return filled;
};

export default function AccountInfo() {
    const { user, isLoading: authLoading } = useAuth();
    const [sub, setSub] = useState<string>("");
    const [activeTab, setActiveTab] = useState<"account" | "activities">("account");
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [period, setPeriod] = useState<string>("day");

    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    const userData = {
        email: user?.profile.email || ""
    };

    const handleDeleteAccount = () => {
        if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            console.log("Deleting account...");
        }
    };

    const handlePeriodChange = (period: string) => {
        setPeriod(period);
    };

    useEffect(() => {
        async function getAuthToken() {
            try {
                let tok = user?.profile.sub;
                if (tok) {
                    console.log(tok);
                    setSub(tok);
                }
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        }
        getAuthToken();
    }, [user]);

    useEffect(() => {
        async function getActivity() {
            if (!sub) return;
            try {
                const activityGet: ActivityItem[] = await reviewActivity(period, sub);
                console.log("sub", sub);
                console.log(activityGet);
                
                if (activityGet.length === 0) {
                    setActivity([]);
                    return;
                }
                
                // Sort by sort_date to ensure proper ordering (ascending first for gap filling)
                const sortedActivity = activityGet.sort((a, b) => {
                    return new Date(a.sort_date).getTime() - new Date(b.sort_date).getTime();
                });
                
                // Fill in gaps with zero values
                const filledActivity = fillActivityGaps(sortedActivity, period);
                
                // Reverse to show most recent first
                setActivity(filledActivity.reverse());
            } catch (error) {
                console.error("Error fetching activity:", error);
                setActivity([]);
            }
        }

        getActivity();
    }, [period, sub]);

    return (
        <>
            {(authLoading) ? (
                <div className={styles.loadingText}>Loading chains and token...</div>
            ) :
                <div className={styles.pageContainer}>
                    <NavBar />

                    {/* 1. Hero Banner (Pink Section) */}
                    <div className={styles.heroSection}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatar}>
                                <AvatarIcon />
                            </div>
                        </div>
                        <div className={styles.heroText}>
                            <h1>{userData.email}</h1>
                        </div>
                    </div>

                    {/* 2. Overlapping Content Section */}
                    <div className={styles.contentWrapper}>

                        {/* Left Sidebar */}
                        <div className={styles.sidebar}>
                            <button
                                className={`${styles.sidebarButton} ${activeTab === "account" ? styles.activeTab : ""
                                    }`}
                                onClick={() => setActiveTab("account")}
                            >
                                Account
                            </button>
                            <button
                                className={`${styles.sidebarButton} ${activeTab === "activities" ? styles.activeTab : ""
                                    }`}
                                onClick={() => setActiveTab("activities")}
                            >
                                Activities
                            </button>
                        </div>

                        {/* Right Content Card */}
                        <div className={styles.card}>
                            {activeTab === "account" && (
                                AccountTab(userData, handleDeleteAccount, () => setPasswordModalOpen(true))
                            )}

                            {activeTab === "activities" && (
                                ActivitiesTab(period, sub || "", activity || [], handlePeriodChange)
                            )}
                        </div>
                    </div>
                    <ChangePasswordModal
                        isOpen={isPasswordModalOpen}
                        onClose={() => setPasswordModalOpen(false)}
                    />
                </div>}
        </>
    )
}

function AccountTab(userData: { email: string; }, handleDeleteAccount: () => void, onChangePassword: () => void): React.ReactNode {
    return <>
        <h2 className={styles.cardTitle}>Account Information</h2>

        <div className={styles.infoRow}>
            <div className={styles.infoLabel}>User Email</div>
            <div className={styles.infoValue}>{userData.email}</div>
        </div>

        <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Password</div>
            <div className={styles.infoValue}>
                <span className={styles.actionLink} onClick={onChangePassword}>Change Password</span>
            </div>
        </div>
    </>;
}

function ActivitiesTab(period: string, shopperID: string, activity: ActivityItem[], handlePeriodChange: (period: string) => void): React.ReactNode {
    return (
        <>
            <h2 className={styles.cardTitle}>Activity</h2>

            <div className={styles.periodButtons}>
                <button
                    className={period === "day" ? styles.activePeriodButton : styles.periodButton}
                    onClick={() => handlePeriodChange("day")}
                >
                    Daily
                </button>
                <button
                    className={period === "week" ? styles.activePeriodButton : styles.periodButton}
                    onClick={() => handlePeriodChange("week")}
                >
                    Weekly
                </button>
                <button
                    className={period === "month" ? styles.activePeriodButton : styles.periodButton}
                    onClick={() => handlePeriodChange("month")}
                >
                    Monthly
                </button>
            </div>
            <div className={styles.infoValue}>
                {activity.length === 0 ? (
                    <div>No activity found.</div>
                ) : (
                    <ul className={styles.activityList}>
                        {activity.map((item, index) => (
                            <li key={`${item.period}-${index}`} className={styles.activityItem}>
                                <span className={styles.activityPeriod}>
                                    {formatPeriodDisplay(item.period, period)}
                                </span>
                                <span className={styles.activityTotal}>
                                    ${item.total_spent.toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}