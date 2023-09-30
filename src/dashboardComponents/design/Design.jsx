"use client";
import React, { useContext, useEffect, useState } from "react";
import styles from "./Design.module.scss";
import Image from "next/image";
import { MdRebaseEdit } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiCairographics, SiConstruct3 } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DesignContext from "../contexts/designContext/DesignContext";
import {
  AddSingleDesign,
  setDesignIndex,
  toogleDesignPhoto,
} from "../contexts/designContext/dispatchDesignActions";
import { deleteDesign } from "../contexts/designContext/designActions";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";


function Design({ designs, session }) {
  
  const { dispatch } = useContext(DesignContext);
  const [actionsVisible, setActionsVisible] = useState(false);
  const desgn = designs.designs;
  // console.log({desgn})
  const images = desgn.map((item) => item);
  // console.log(images)

  const designPublicId = images.map((item) => item.design[0].public_id);
  // console.log(designPublicId[1])
  const router = useRouter();
  // handle delete function

  const handleDelete = async (id, designPublic_id) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (userConfirmed) {
      try {
        const response = await deleteDesign(id, designPublic_id);
        toast.success(response.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.refresh(); // Adapt this based on your routing setup
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while deleting the project", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };
  useEffect(() => {
    router.refresh();
  }, [router.refresh]);
  
  return (
    <div className={styles.container}>
      <ToastContainer style={{ fontSize: "14px", marginTop: "5rem" }} />
      <div className={styles.containerTitle}>
        <h1>Design</h1>
      </div>
      <div className={styles.design}>
        <div className={styles.designTop}>
          <div className={styles.designTopTitle}>
            <h1>Designs</h1>
          </div>
          {session?.user?.role == "admin" && (
          <div className={styles.designTopButton}>
            <Link href="/dashboard/design/new_design">
              <button>
                <SiCairographics className={styles.icon} />
                New Design
              </button>
            </Link>
          </div>
          )}
        </div>
        <div className={styles.designBottom}>
          <div className={styles.images}>
            {images.map((item, index1) => (
              <div
                className={styles.imageCont}
                key={index1}
                onMouseEnter={() => setActionsVisible(index1)}
                onMouseLeave={() => setActionsVisible(-1)}
              >
                {item.design.map((item, index) => (
                  <div key={index} className={styles.icont}>
                    <Image
                      src={item.secure_url}
                      alt={item.original_filename}
                      width={300}
                      height={300}
                      quality={100}
                      className={styles.img}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={`data:image/jpeg;base:64,${item.secure_url}`}
                      onClick={() => {
                        dispatch(setDesignIndex(index1));
                        dispatch(toogleDesignPhoto());
                        dispatch(AddSingleDesign(images));
                      }}
                    />
                  </div>
                ))}
                <div className={styles.imageDescription}>
                  <p>{item.description}</p>
                </div>
                {session?.user?.role == "admin" && (
                  actionsVisible === index1 && (
                    <div className={styles.actions}>
                      <Tooltip
                        title="edit"
                        position="left"
                        style={{ fontSize: "1.6rem", backdropFilter: "none" }}
                      >
                        <Link href={`/dashboard/design/${item._id}`}>
                          <i className={styles.edit}>
                            <MdRebaseEdit />
                          </i>
                        </Link>
                      </Tooltip>
                      {/**/}
                      <Tooltip
                        title="delete"
                        position="top"
                        style={{ fontSize: "1.6rem", backdropFilter: "none" }}
                      >
                        <i
                          className={styles.delete}
                          onClick={() =>
                            handleDelete(item._id, designPublicId[index1])
                          }
                        >
                          <AiFillDelete />
                        </i>
                      </Tooltip>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Design;
