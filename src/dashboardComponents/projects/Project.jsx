"use client";
import React, { useEffect } from "react";
import styles from "./Project.module.scss";
import Card from "./card/Card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


function Project({ project }) {
  const router = useRouter();
  const { data: session } = useSession()

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <div className={styles.top}>
          <div className={styles.title}>
            <h1>Projects</h1>
          </div>
          <div className={styles.smTitle}>
            <h1>Projects</h1>
            {session?.user?.role == "admin" && (
            <div className={styles.buttonCont}>
              <Link href="/dashboard/projects/newProject">
                <button>Add new Project</button>
              </Link>
            </div>
            )}
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.card}>
            {project?.projects?.map((item, index) => (
              <div key={index}>
                <Card project={item} id={index}/>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.containerRight}>
        <ul>
          {/* <li className={styles.addProj}>addProject</li> */}
          {project?.projects?.map((item, index) => (
            <li key={index}><a href={`#${index}`}>{item.projectName}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Project;
