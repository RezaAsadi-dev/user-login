"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { Button } from "../../components/ui/button";
import styles from "./welcome-card.module.scss";

export function WelcomeCard() {
  const { user, logout, isHydrated } = useAuthStore();
  const router = useRouter();
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

useEffect(() => {
  const justLoggedIn = sessionStorage.getItem("justLoggedIn");
  if (justLoggedIn === "true") {
    setShowWelcomeAlert(true);
    sessionStorage.removeItem("justLoggedIn");
  }

  const timeout = setTimeout(() => {
    setAnimateOut(true); 
  }, 2000);

  const timer = setTimeout(() => {
    setShowWelcomeAlert(false); 
    setAnimateOut(false);
  }, 2600);  

  return () => {
    clearTimeout(timeout);
    clearTimeout(timer);
  };
}, []);


  // Redirect if not logged in
  useEffect(() => {
    if (isHydrated && !user) {
      router.push("/auth");
    }
  }, [isHydrated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };
  if (!isHydrated) {
    return (
      <div className={styles.welcomeCard}>
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <div style={{ fontSize: "1.125rem", fontWeight: "500" }}>
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = `${user.name.first} ${user.name.last}`;

  return (
    <div className={styles.welcomeCard}>
      {showWelcomeAlert && (
        <div
          className={`${styles.welcomeBox} ${
            animateOut ? styles.slideOutRight : ""
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#3c3939"
            width="24px"
            height="24px"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                stroke="#34986d"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                opacity="0.34"
                d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
                stroke="#34986d"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
          Welcome back, {fullName}!
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img
            src={
              user.picture.large ||
              "/placeholder.svg?height=100&width=100&query=user avatar"
            }
            alt={`${fullName}'s avatar`}
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.name}>Hello, {fullName}! </h2>
          <p className={styles.email}>{user.email}</p>
        </div>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}> Location</span>
          <span className={styles.value}>
            {user.location.city}, {user.location.state}, {user.location.country}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}> Phone</span>
          <span className={styles.value}>{user.phone}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}> Username</span>
          <span className={styles.value}>{user.login.username}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}> Age</span>
          <span className={styles.value}>{user.dob.age} years old</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="outline"
          onClick={handleLogout}
          size="md"
          className={styles.logoutButton}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
