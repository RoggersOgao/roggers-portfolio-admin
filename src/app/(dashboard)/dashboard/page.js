
// The code below is for getting session for a server component
import Home from "@/dashboardComponents/home/Home"
import styles from "./page.module.scss"
import { SpinnerDiamond } from 'spinners-react'
import { getServerSession } from "next-auth/next"
import { options } from "@/app/api/auth/[...nextauth]/options"
import { fetchCrUsers, fetchDesigns, fetchGithubUsers, fetchGoogleUsers, fetchProjects, fetchUser } from "@/dashboardComponents/contexts/dashHomeContext/DashActions"
import { Suspense } from "react"


export default async function Page() {
  const session = await getServerSession(options)
  // Function to count users for a specific year
  const crUsers =  fetchUser();
  const gbUsers =  fetchGithubUsers();
  const ggUsers =  fetchGoogleUsers();
  const crdUsers = fetchCrUsers();
  

  const [users, gguser, gbuser, cUsers] = await Promise.all([crUsers, ggUsers, gbUsers, crdUsers])

  const designs = await fetchDesigns()
  const projects = await fetchProjects()

  // console.log(users)
  // console.log(gguser)
  // console.log(gbuser)


  const combinedUsersForCalendar = [...gguser.user, ...gbuser.user, ...cUsers.users]
  const combinedUsers = [...users.users]
  const numGoogleUsers = [...gguser.user].length
  const numGithubUsers = [...gbuser.user].length

  
  return session ? (<div>
      <div className={styles.container}>
        <div className={styles.right}>
          <Suspense fallback="loading...">
          <Home combinedUsers={combinedUsers} numGoogleUsers={numGoogleUsers} numGithubUsers={numGithubUsers} combinedUsersForCalendar={combinedUsersForCalendar} designs={designs} projects={projects} session={session}/>
          </Suspense>
        </div>
      </div>
  
    </div>) : <div className={styles.loader}>
      <SpinnerDiamond size={100} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(74, 172, 57, 1)" />
    </div>;
}