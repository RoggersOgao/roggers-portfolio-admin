"use client"
import React from 'react'
import styles from "./SideNav.module.scss"
import { GiModernCity, GiCube, GiPaintBrush } from 'react-icons/gi'
import { FiLogOut } from 'react-icons/fi'
import { AiFillSetting } from 'react-icons/ai'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

function SideNav() {
  const handleLogout = async () => {
    await signOut("google", { callbackUrl: "/" })
  }
  return (
    <div className={styles.container}>
      <div className={styles.sideNav}>
        <aside>
          <nav>
            <ul className={styles.list}>
              <Tooltip title="home" position='right' style={{fontSize:"1.5rem"}}>
                <li>
                  <Link href="/dashboard" className={styles.link}><GiModernCity className={styles.icon} /></Link>
                </li>
              </Tooltip>
              <Tooltip title="projects" position='right'>
                <li>
                  <Link href="/dashboard/projects" className={styles.link}><GiCube className={styles.icon} /></Link>
                </li>
              </Tooltip>
              <Tooltip title="graphic design artwork" position='right'>
                <li>
                  <Link href="/dashboard/design" className={styles.link}><GiPaintBrush className={styles.icon} /></Link>
                </li>
              </Tooltip>
              <Tooltip title="settings" position='right'>
                <li>
                  <Link href="/dashboard/settings" className={styles.link}><AiFillSetting className={styles.icon} /></Link>
                </li>
              </Tooltip>
              <Tooltip title="logout" position='right'>
                <li>
                  <FiLogOut className={styles.icon} onClick={handleLogout} />
                </li>
              </Tooltip>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  )
}

export default SideNav