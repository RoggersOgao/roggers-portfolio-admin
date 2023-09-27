import styles from "./page.module.scss";
import { redirect } from "next/navigation";
import { SpinnerCircular } from "spinners-react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import Design from "@/dashboardComponents/design/Design";
import CarouselCont from "@/dashboardComponents/design/carouselCont/CarouselCont";
import { fetchDesign } from "@/dashboardComponents/contexts/designContext/designActions";

export const metadata = {
  title: "Graphic Design . Portfolio",
  description: "complete next app created with love!",
};

export default async function page() {
  const session = await getServerSession(options);
  const design = await fetchDesign();

  return session ? (
    <div className={styles.container}>
      <CarouselCont />
      <div className={styles.right}>
        <Suspense fallback="loading...">
          <Design designs={design} session={session}/>
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
