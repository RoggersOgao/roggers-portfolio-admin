"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import styles from "./Corousel.module.scss";
import {GiBroadheadArrow} from 'react-icons/gi'
import DesignContext from "@/dashboardComponents/contexts/designContext/DesignContext";
function Corousel({design}) {
  const {state} = useContext(DesignContext)
  
  const [index, setIndex] = useState(state.designIndex);
  const images = design.map((item)=>item.design[0])
  const description= design.map((item)=>item.description)

  const handlePrevClick = () => {
    setIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextClick = () => {
    setIndex((prevIndex) => Math.min(prevIndex + 1, images.length - 1));
  };
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      handlePrevClick();
    } else if (event.key === 'ArrowRight') {
      handleNextClick();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const currentImage = images[index];
  return (
    <div className={styles.container}>
      <div className={styles.contentLeft}>
        <div className={styles.smCont}>
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
              <h1>{description[index]}</h1>
            </div>
            <div className={styles.name}>
              <p>Roggers Ogao</p>
            </div>
          </div>
        </div>
        <div className={styles.imgCont}>
          <Image
            src={currentImage.secure_url}
            alt={currentImage.original_filename}
            width={600}
            height={600}
            className={styles.img}
            placeholder="blur"
            blurDataURL={`data:image/jpeg;base:64,${currentImage.secure_url}`}
          />
        </div>

        <div className={styles.carouselNnav}>
          <button
            className={styles.prev}
            onClick={handlePrevClick}
            disabled={index === 0}
            style={{display:index === 0 ? "none": "flex"}}
          >
            <GiBroadheadArrow className={styles.leftIcon}/>
          </button>
          <button
            className={styles.next}
            onClick={handleNextClick}
            disabled={index === images.length - 1}
            style={{display:index === images.length - 1 ? "none": "flex"}}
          >
            <GiBroadheadArrow className={styles.rightIcon}/>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Corousel;
