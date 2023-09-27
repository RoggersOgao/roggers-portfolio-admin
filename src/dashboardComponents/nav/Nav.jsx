import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import React from 'react'
import styles from "./Nav.module.scss"
import TopNav from './topNav/TopNav'

async function Nav() {
    const session = await getServerSession(options)
  if(!session){
      redirect("/")
  }
    return session ? (
        <div className={styles.container}>
            <TopNav session={session}  />
        </div>
    ): null
}

export default Nav