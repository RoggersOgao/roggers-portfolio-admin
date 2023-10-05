"use client"
import React, { useEffect, useState } from 'react'
import styles from "./TopNav.module.scss"
import Image from 'next/image'

// import { CiLogout } from "react-icons/ci"
function TopNav({ session }) {
    const [loading, setLoading] = useState(session);

    useEffect(() => {
        if (!session) {
            // Simulate loading delay for 2 seconds (replace with your actual data fetching logic)
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [session]);


    return loading ? (
        <div className={styles.container}>
            <div className={styles.nav}>
                <div className={styles.navLeft}>
                    <Image
                        src="/assets/logo.png"
                        alt="intellisirn logo"
                        width={80}
                        height={40}
                        className={styles.logo}
                    />
                </div>
                <div className={styles.navRight}>
                    <div className={styles.profile}>
                        <div className={styles.name}>
                            <p>Hello! {session?.user?.name
                                .split(' ')
                                .slice(0, 2)
                                .join(' ')} </p>
                        </div>
                        <div className={styles.image}>
                            {!session?.user?.image || session?.user?.image === "" ?
                                <Image
                                    src="https://res.cloudinary.com/dhk9gwc4q/image/upload/v1690988668/samples/animals/three-dogs.jpg"
                                    alt="profile Image"
                                    width={60}
                                    height={60}
                                    className={styles.profile}
                                />
                                : (
                                    <Image
                                        src={session?.user.image}
                                        alt="profile Image"
                                        width={60}
                                        height={60}
                                        className={styles.profile}
                                    />

                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ): <div className={styles.loadingNav}>
        <div className={styles.left}>
            <div className={styles.name}></div>
        </div>
        <div className={styles.right}>
            <div className={styles.nameLoading}></div>
            <div className={styles.imageLoading}></div>
        </div>
    </div>
}

export default TopNav