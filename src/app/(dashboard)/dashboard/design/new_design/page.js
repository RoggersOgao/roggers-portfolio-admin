import styles from "./page.module.scss"
import { redirect } from "next/navigation";
import { SpinnerCircular } from "spinners-react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import NewDesign from "@/dashboardComponents/design/newDesign/NewDesign";


export default async function Page(){
    const session = await getServerSession(options)
    if(!session){
        redirect("/")
    }

    return session ? (
        <div className={styles.container}>
            <div className={styles.design}>
            <Suspense fallback="loading...">
                <NewDesign session={session}/>
            </Suspense>
            </div>
        </div>
        ) : <div className={styles.loader}>
        <SpinnerCircular size={100} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(74, 172, 57, 1)" />
      </div>
}