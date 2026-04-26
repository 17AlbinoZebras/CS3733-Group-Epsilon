import { AuthContextProps, AuthState, useAuth } from "react-oidc-context";
import styles from "./Navbar.module.css";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const auth = useAuth();
    async function signOutRedirect() {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
    const logoutUri = process.env.NEXT_PUBLIC_REDIRECT_URI!;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  }
  // Define the list of navigation links
  const links = [
    { name: "Dashboard", href: "/", isActive: false, isDisabled: false },
    { name: "My Receipts", href: "/review-receipts-history", isActive: false, isDisabled: false },
    { name: "Shopping Lists", href: "/shopping-list", isActive: false, isDisabled: false },
    {
      name: "Chains & Stores",
      href: "/chains-and-stores",
      isActive: false,
      isDisabled: false,
    }, // Highlight 'Stores' as the current page
    { name: "My Account", href: "/account-info", isActive: false, isDisabled: false },
  ];

  const handleLogout = async () => {
    await auth.removeUser();
    await signOutRedirect();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <a href="/" className={styles.appName}>
          ShopComp
        </a>
        <div className={styles.navLinks}>
          {links.map((link) => {
            if (!link.isDisabled) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`${styles.navLink} ${
                    link.isActive ? styles.active : ""
                  }`}
                >
                  {link.name}
                </a>
              );
            } else {
              return (
                <span
                  key={link.name}
                  className={`${styles.disabledLink}`}
                >
                  {link.name}
                </span>
              );
            }
          })}
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
