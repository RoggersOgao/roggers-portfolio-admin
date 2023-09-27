import SideNav from "@/dashboardComponents/nav/sideNav/SideNav";
import styles from "./page.module.scss";
import { redirect } from "next/navigation";
import { SpinnerCircular } from "spinners-react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import Project from "@/dashboardComponents/projects/Project";
import { fetchProject } from "@/dashboardComponents/contexts/projectContext/projectActions";
import ImgCont from "@/dashboardComponents/projects/projectPhoto/imgCont/ImgCont";

export const metadata = {
  title: 'All Projects . Portfolio',
  description: 'complete next app created with love!',
}

export default async function Page() {
  const session = await getServerSession(options);
  const delay = (delaryInms) => {
    return new Promise((resolve) => setTimeout(resolve, delaryInms));
  };
  if (!session) {
    delay(4000);
    redirect("/");
  }
  const project = await fetchProject();

  return session ? (
    <div className={styles.container}>
      <div className={styles.right}>
       <ImgCont />
        <Suspense fallback="loading...">
          <Project project={project || []} session={session} />
        </Suspense>
      </div>
    </div>
  ) : (
    <div className={styles.loader}>
      <SpinnerCircular
        size={100}
        thickness={100}
        speed={100}
        color="rgba(255, 255, 255, 1)"
        secondaryColor="rgba(74, 172, 57, 1)"
      />
    </div>
  );
}
