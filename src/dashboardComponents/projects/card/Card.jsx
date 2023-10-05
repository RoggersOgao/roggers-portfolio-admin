"use client";
import React, { useContext } from "react";
import styles from "./Card.module.scss";
import Image from "next/image";
import { GiCube } from "react-icons/gi";
import { MdRebaseEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AiFillDelete, AiFillCode, AiOutlineLink } from "react-icons/ai";
import { GiTechnoHeart, GiBinoculars } from "react-icons/gi";
import Link from "next/link";
import { deleteProject } from "@/dashboardComponents/contexts/projectContext/projectActions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProjectContext from "@/dashboardComponents/contexts/projectContext/ProjectContext";
import { useSession } from "next-auth/react";
import {
  AddSingleProject,
  toogleProjectPhoto,
} from "@/dashboardComponents/contexts/projectContext/dispatchActions";

function Card({ project, id }) {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(ProjectContext);
  const coverPhoto = project.coverPhoto.map((item) => item.secure_url);
  const coverPhotoPublicId = project.coverPhoto.map((item) => item.public_id);
  const projectPhotoPublicId = project.projectPhoto.map(
    (item) => item.public_id
  );
  // console.log(project._id);
  // console.log(coverPhotoPublicId[0])
  // console.log(projectPhoto)
  // console.log(projectPhotoPublicId[0])
  const router = useRouter();
  const mongoTimestamp = new Date(project.createdAt); // Replace with your actual timestamp

  // Define an array of short month names
  const shortMonthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract the month and year from the timestamp
  const monthIndex = mongoTimestamp.getMonth(); // Returns a number from 0 (January) to 11 (December)
  const year = mongoTimestamp.getFullYear();

  // Get the short month name
  const shortMonth = shortMonthNames[monthIndex];

  const handleDelete = async (id, coverId, projectId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (userConfirmed) {
      try {
        const response = await deleteProject(id, coverId, projectId);
        console.log(response)
        // alert("deleted successfully!")
        toast.success("Project deleted successfully", {
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
  return (
    <div className={styles.container} id={id}>
      <ToastContainer style={{ fontSize: "14px" }} />
      <div className={styles.card}>
        <div
          className={styles.cardTop}
          onClick={() => {
            try {
              dispatch(AddSingleProject(project));
              dispatch(toogleProjectPhoto());
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Image
            src={coverPhoto[0]}
            alt="project called Image photography"
            width={1520}
            height={1000}
            quality={100}
            loading="lazy"
            className={styles.img}
            placeholder="blur"
            blurDataURL={`data:image/jpeg;base:64,${coverPhoto[0]}`}
          />
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.titleArea}>
            <p className={styles.title}>Code Quest</p>
            {session?.user.role == "admin" && (
              <div className={styles.actions}>
                <Link href={`/dashboard/projects/${project._id}`}>
                  <i className={styles.edit}>
                    <MdRebaseEdit />
                  </i>
                </Link>
                {/**/}
                <i
                  className={styles.delete}
                  onClick={() =>
                    handleDelete(
                      project._id,
                      coverPhotoPublicId[0],
                      projectPhotoPublicId[0]
                    )
                  }
                >
                  <AiFillDelete />
                </i>
              </div>
            )}
          </div>
          <div className={styles.dateGroup}>
            <p>
              {shortMonth} <span className={styles.year}>{year}</span>
            </p>
            <span className={styles.line}></span>
          </div>
          <div className={styles.projectBottomText}>
            <span className={styles.line}></span>
            <div className={styles.projectName}>
              <span>
                <GiCube />
              </span>
              <h2>{project.projectName}</h2>
            </div>
            <div className={styles.projectOverview}>
              <span>
                <GiTechnoHeart />
              </span>
              <p>{project.projectDescription}</p>
            </div>
            <div className={styles.techUsed}>
              <span>
                <AiFillCode />
              </span>
              <div className={styles.technologies}>
                {project.technologies.map((item, index) => (
                  <p key={index}>
                    {item.label}{" "}
                    {index !== project.technologies.length - 1 && ","}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.projectLink}>
              <span>
                <AiOutlineLink />
              </span>
              <p>{project.projectLink}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
