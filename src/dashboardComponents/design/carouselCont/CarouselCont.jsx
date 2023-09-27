"use client";
import React, { useContext, useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";
import styles from "./CarouselCont.module.scss";
import { BsInstagram } from "react-icons/bs";
import { FiLinkedin } from "react-icons/fi";
import Corousel from "../corousel/Corousel";
import DesignContext from "@/dashboardComponents/contexts/designContext/DesignContext";
import { closeDesignPhoto } from "@/dashboardComponents/contexts/designContext/dispatchDesignActions";
function CarouselCont() {
  const { state, dispatch } = useContext(DesignContext);
  const designs = state.designs

  useEffect(() => {
    if (state.isVisible) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'auto';   // Enable scrolling
    }

    return () => {
      document.body.style.overflow = 'auto';   // Clean up when unmounting
    };
  }, [state.isVisible]);
  
  return (
    <>
      {state.isVisible && (
        <div className={styles.imgCont}>
          <div
            className={styles.closeBtn}
            onClick={() => dispatch(closeDesignPhoto())}
          >
            <i>
              <MdOutlineClose />
            </i>
          </div>
          <div className={styles.links}>
            <div className={styles.profile}>
              <div className={styles.profileImg}>
                <Image
                  src={
                    "/assets/abstract-colorful-splash-3d-background-generative-ai-background.jpg"
                  }
                  alt="abstract-colorful-splash-3d-background-generative-ai-background"
                  width={50}
                  height={50}
                  quality={100}
                  className={styles.img}
                />
              </div>
              <p>Follow</p>
            </div>
            <a
              href="https://www.instagram.com/roggers_ogao/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.instagram}>
                <i>
                  <BsInstagram />
                </i>
              </div>
            </a>
            <a
              href="https://www.linkedin.com/in/roggers-ogao-b35718202/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.linkedIn}>
                <i>
                  <FiLinkedin />
                </i>
              </div>
            </a>
          </div>
          <div className={styles.imgProject}>
            <Corousel design = {designs}/>
          </div>
        </div>
      )}
    </>
  );
}

export default CarouselCont;
