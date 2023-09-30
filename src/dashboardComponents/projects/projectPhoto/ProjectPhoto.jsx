import Image from "next/image";
import React from "react";
import styles from "./ProjectPhoto.module.scss";

function ProjectPhoto({ project, loading }) {
  const photo = project.projectPhoto.map((item) => item.secure_url);
  // console.log(photo)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.contentLeft}>
          <div className={styles.profile}>
            <div className={styles.profileLeft}>
              <Image
                src="/assets/abstract-colorful-splash-3d-background-generative-ai-background.jpg"
                alt="abstract-colorful-splash-3d-background-generative-ai-background"
                width={50}
                height={50}
                quality={100}
                className={styles.img}
              />
            </div>
            <div className={styles.profileRight}>
              <div className={styles.profileRightTitle}>
                <h1>{project.projectName}</h1>
              </div>
              <div className={styles.name}>
                <p>Roggers Ogao</p>
              </div>
            </div>
          </div>
          <div className={styles.imgCont}>
            {!loading ? (
              <Image
                src={photo[0]}
                alt={photo[0]}
                width={1200}
                height={756}
                quality={100}
                className={styles.img}
                loading="lazy"
                placeholder="blur"
                blurDataURL={`data:image/jpeg;base:64,${photo[0]}`}
              />
            ) : (
              "loading..."
            )}
          </div>
        </div>
        <div className={styles.contentRight}>{/* <p>rightside</p> */}</div>
      </div>
    </div>
  );
}

export default ProjectPhoto;
