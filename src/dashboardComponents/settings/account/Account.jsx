"use client";
import React, { useState } from "react";
import styles from "./Account.module.scss";
import { AiOutlineUser } from "react-icons/ai";
import { PiPasswordThin } from "react-icons/pi";
import { MdOutlineManageHistory } from "react-icons/md";
import cls from "classnames";
import { HiOutlineCube } from "react-icons/hi";
import Profile from "./profileSettings/Profile";
import Password from "./password/Password";
import Manage from "./managePortfolio/Manage";

function Account({session}) {
  
  const [activeItem, setActiveItem] = useState("profile"); // Set the default active item

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  return (
    <div className={styles.container}>
      <div className={styles.account}>
        <div className={styles.accountLeft}>
          <div className={styles.navCont}>
            <div className={styles.top}>
              <HiOutlineCube className={styles.icon} />
              <p className={styles.path}>/dashboard/settings</p>
            </div>
            <ul className={styles.navList}>
              <li
                className={
                  activeItem === "profile"
                    ? cls(styles.activeNavItem, styles.navItem)
                    : styles.navItem
                }
                onClick={() => handleItemClick("profile")}
              >
                <AiOutlineUser className={styles.icon} /> Profile Settings
              </li>
              {session?.user.role == "admin" && (
                <>
                  <li
                    className={
                      activeItem === "password"
                        ? cls(styles.activeNavItem, styles.navItem)
                        : styles.navItem
                    }
                    onClick={() => handleItemClick("password")}
                  >
                    <PiPasswordThin className={styles.icon} /> Password
                  </li>
                  <li
                    className={
                      activeItem === "portfolio"
                        ? cls(styles.activeNavItem, styles.navItem)
                        : styles.navItem
                    }
                    onClick={() => handleItemClick("portfolio")}
                  >
                    <MdOutlineManageHistory className={styles.icon} /> Manage
                    Portfolio
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.accountRight}>
          {activeItem === "profile" && <Profile session={session} />}
          {activeItem === "password" && <Password session={session} />}
          {activeItem === "portfolio" && <Manage session={session} />}
        </div>
      </div>
    </div>
  );
}

export default Account;
