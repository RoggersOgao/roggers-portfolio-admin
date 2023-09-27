import Nav from "@/dashboardComponents/nav/Nav";
import styles from "./layout.module.scss";
import SideNav from "@/dashboardComponents/nav/sideNav/SideNav";
import { DashProvider } from "@/dashboardComponents/contexts/dashHomeContext/DashContext";
import { ProjectProvider } from "@/dashboardComponents/contexts/projectContext/ProjectContext";
import { DesignProvider } from "@/dashboardComponents/contexts/designContext/DesignContext";
import { SettingsProvider } from "@/dashboardComponents/contexts/settingsContext/SettingsContext";
export const metadata = {
  title: "Roggers Portfolio Dashboard",
  description: "Coded by Roggers",
};

export default async function RootLayout({ children }) {

  return (
    <section>
      <Nav />
      <div className={styles.container}>
        <div className={styles.left}>
          <SideNav />
        </div>
        <div className={styles.right}>
          <DashProvider>
            <SettingsProvider>
              <DesignProvider>
                <ProjectProvider>{children}</ProjectProvider>
              </DesignProvider>
            </SettingsProvider>
          </DashProvider>
        </div>
      </div>
    </section>
  );
}
