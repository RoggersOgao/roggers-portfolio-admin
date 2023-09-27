import styles from "./page.module.scss"
import { redirect } from "next/navigation";
import { SpinnerCircular } from "spinners-react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import Settings from "@/dashboardComponents/settings/Settings";

export const metadata = {
    title: 'Settings . Portfolio',
    description: 'complete next app created with love!',
  }
  
export default async function Page(){
    try{
    const session = await getServerSession(options)

    setTimeout(() => {
        // Use your preferred method of redirection, for example, React Router
        // This assumes you are using React Router, so make sure to import it.
        // Replace '/login' with the actual path you want to redirect to.
        redirect("/");
      }, 4000); // 8000 milliseconds = 8 seconds
    } catch (error) {
      // Handle errors from getSession here
    }
    return session ? (
        <div className={styles.container}>
            <div className={styles.right}>
            <Suspense fallback="loading...">
                <Settings session={session}/>
            </Suspense>
            </div>
        </div>
        ) : <div className={styles.loader}>
        <SpinnerCircular size={100} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(74, 172, 57, 1)" />
      </div>
}