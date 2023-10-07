"use client";
import Image from "next/image";
import React, { useState } from "react";
import styles from "./ProjectPhoto.module.scss";
import { SpinnerDiamond } from "spinners-react";

function ProjectPhoto({ project }) {
  const [loading, setLoading] = useState(true);

  const handleImageLoading = () => {
    setLoading(false);
  };

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
                fill
                quality={100}
                className={styles.img}
                unoptimized={true}
                loading="lazy"
                onLoadingComplete={handleImageLoading}
                placeholder="blur"
                blurDataURL={`data:image/jpeg;base:64,${photo[0]}`}
              />
            ) : (
              <div className={styles.loader}>
                <SpinnerDiamond
                  size={100}
                  thickness={100}
                  speed={100}
                  color="rgba(255, 255, 255, 1)"
                  secondaryColor="rgba(74, 172, 57, 1)"
                />
                <p>loading project...</p>
              </div>
            )}
          </div>
        </div>
        {/* <div className={styles.contentRight}><p>rightside</p></div> */}
      </div>
    </div>
  );
}

export default ProjectPhoto;
