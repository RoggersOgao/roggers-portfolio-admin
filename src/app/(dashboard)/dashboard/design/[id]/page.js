import { getServerSession } from "next-auth"; //using server session
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import styles from "../new_design/page.module.scss"
import { SpinnerCircular } from "spinners-react";
import { fetchDesignById } from "@/dashboardComponents/contexts/designContext/designActions";
import EditDesign from "@/dashboardComponents/design/editDesign/EditDesign";

export default async function Page({params}){
    const session = await getServerSession(options)

    const delay = (delaryInms) => {
        return new Promise((resolve) => setTimeout(resolve, delaryInms));
      };
      if (!session) {
        delay(4000);
        redirect("/");
      }

      const { designs: designData } = await fetchDesignById(params.id);

    
    console.log(designData)
    const designPhoto_public_id = designData.design.map((img)=> img.public_id)

    return session ? (
        <div className={styles.container}>
            <div className={styles.project}>
            <Suspense fallback="loading...">
                <EditDesign designData={designData} session={session} designPhoto_public_id={designPhoto_public_id}/>
            </Suspense>
            </div>
        </div>

    ): <div className={styles.loader}>
        <SpinnerCircular size={100} thickness={100} speed={100} color="rgba(255, 255, 255, 1)" secondaryColor="rgba(74, 172, 57, 1)" />
      </div>
}