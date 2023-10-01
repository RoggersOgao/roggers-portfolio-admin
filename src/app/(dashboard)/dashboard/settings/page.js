import styles from "./page.module.scss";
import { SpinnerCircular } from "spinners-react";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Suspense } from "react";
import Settings from "@/dashboardComponents/settings/Settings";

export const metadata = {
  title: "Settings . Portfolio",
  description: "complete next app created with love!",
};

export default async function Page() {
  const session = await getServerSession(options);
  return session ? (
    <div className={styles.container}>
      <div className={styles.right}>
        <Suspense fallback="loading...">
          <Settings session={session} />
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
