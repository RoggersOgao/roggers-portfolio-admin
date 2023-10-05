"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./EditProjectForm.module.scss";
import Dropzone from "./dropzone/Dropzone";
import { tech } from "./technologies";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  updateProject,
  uploadData,
} from "@/dashboardComponents/contexts/projectContext/projectActions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { VscError } from "react-icons/vsc";
import { PiSpinnerLight } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiConsoleController } from "react-icons/gi";
import CircularBar from "@/dashboardComponents/spinners/circularSpinner/CircularBar";

const animatedComponents = makeAnimated();

function EditProjectForm({ projectData, session }) {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);
  const [displayFiles, setDisplayFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [techl, setTechl] = useState([]);
  const formRef = useRef();
  const selectRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    router.refresh()
    setForm({
      projectName: projectData.projectName,
      projectDescription: projectData.projectDescription,
      projectLink: projectData.projectLink,
    });
    setTechl([...techl, ...projectData.technologies]);
    const uniqueFiles = new Set([...files]);
    setFiles([...uniqueFiles]);
    const uniqueFiles1 = new Set([
      ...files,
      ...projectData.coverPhoto,
      ...projectData.projectPhoto,
    ]);
    setDisplayFiles([...uniqueFiles1]);
  }, []);

  // console.log(files)
  // using useEffect to get data

  const setField = (value, field) => {
    setForm({
      ...form,
      [value]: field,
    });
  };
  // validation of the fields

  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case "projectName":
        if (!value) {
          errors.projectName = "Project name is required!";
        } else if (value.length > 100) {
          errors.projectName = "Name cannot exceed 100 characters";
        } else {
          delete errors.projectName;
        }
        break;
      case "projectDescription":
        if (!value) {
          errors.projectDescription = "Project description is required";
        } else if (value.length < 10 || value.length > 1000) {
          errors.projectDescription =
            "Project description must be between 10 and 1000 characters";
        } else {
          delete errors.projectDescription; // Clear the error if the field is valid
        }
        break;
      case "technologies":
        if (value.length === 0) {
          errors.technologies = "Languages used cannot be empty!";
        } else {
          delete errors.technologies;
        }
        break;
      case "projectLink":
        if (!value) {
          errors.projectLink = "Project link is required";
        } else if (value.length > 160) {
          errors.projectLink = "Project Link cannot exceed 160 characters";
        } else {
          delete errors.projectLink;
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleSelect = (e) => {
    setTechl(e);
  };
  const coverPhotoPublic_id = projectData.coverPhoto.map((img)=> img.public_id)
  const projectPhotoPublic_id = projectData.projectPhoto.map((img)=> img.public_id)

  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      (files.length > 0 && files.length !== 2) ||
      (files.length === 0 && displayFiles.length !== 2)
    ) {
      alert("Please upload exactly 2 images.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("projectName", form.projectName);
    formData.append("projectDescription", form.projectDescription);
    techl.forEach((file) => {
      formData.append("technologies[]", JSON.stringify(file));
    });
    formData.append("projectLink", form.projectLink);

    // Identifying which images are already associated with the project
    const existingImageFilenames = [
      ...projectData.coverPhoto.map((img) => img.original_filename),
      ...projectData.projectPhoto.map((img) => img.original_filename),
    ];

    // console.log("existingImageFilenames:", existingImageFilenames);
    // console.log("files:", files);
    const newFiles = files.filter(
      (file) => !existingImageFilenames.includes(file.name)
    );
    

    try {
      // console.log("newFiles:", newFiles);
      // console.log("hasNewImages:", newFiles.length > 0);
      setIsLoading(true);
      
      const response = await updateProject(projectData._id, formData, newFiles.length > 0, coverPhotoPublic_id[0], projectPhotoPublic_id[0]);
      
      setForm([]);
      setFiles([]);
      setDisplayFiles([]);
      selectRef.current.clearValue();
      setTechl([]);
      formRef.current.reset();
      setIsLoading(false);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      router.push("/dashboard/projects");
    } catch (err) {
      toast.success(err.message, {
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
  };

  return session?.user.role == "admin" ?(
    <div className={styles.container}>
      <h1 className={styles.projectNameBack}>
        Pro
        <br />
        ject
      </h1>
      <div className={styles.formContainer}>
      <ToastContainer style={{ fontSize: "14px" }} />
        <div className={styles.title}>
          <h1>Update Project</h1>
          <Link href="/dashboard/projects">
            <button>Back</button>
          </Link>
        </div>
        <form className={styles.form} onSubmit={handleUpload} ref={formRef}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name=""
              id="name"
              autoComplete="off"
              placeholder="Name"
              required
              value={form.projectName || ""}
              onChange={(e) => {
                setField("projectName", e.target.value),
                  validateField("projectName", e.target.value);
              }}
            />
            <AnimatePresence>
              {formErrors.projectName && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 }} // Add a delay before exit animation
                >
                  <VscError /> {formErrors.projectName}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {/* description */}
          <div className={styles.formGroup}>
            <textarea
              id="description"
              autoComplete="off"
              placeholder="Description"
              required
              value={form.projectDescription || ""}
              onChange={(e) => {
                setField("projectDescription", e.target.value),
                  validateField("projectDescription", e.target.value);
              }}
            />
            <AnimatePresence>
              {formErrors.projectDescription && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 }} // Add a delay before exit animation
                >
                  <VscError /> {formErrors.projectDescription}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {/* technologies */}
          <div className={styles.formGroup}>
            <Select
              ref={selectRef}
              closeMenuOnSelect={false}
              components={animatedComponents}
              options={tech}
              isMulti
              required
              value={techl}
              onChange={(e) => {
                handleSelect(e), validateField("technologies", e);
              }}
              isSearchable={true}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: "var(--background-grey)",
                  border: ".3px solid var(--border-grey)",
                  fontSize: "13px",
                  fontWeight: "600",
                  padding: "4px",
                  borderRadius: "6px",
                }),
                menu: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: "var(--background-text-grey)",
                  fontSize: "13px",
                  fontWeight: "700",
                }),
                multiValue: (baseStyles, state) => ({
                  ...baseStyles,
                  backgroundColor: "var(--border-grey)",
                  color: "white",
                  padding: "4px",
                  borderRadius: "5rem",
                }),
                multiValueLabel: (baseStyles, state) => ({
                  ...baseStyles,
                  color: "white",
                }),
              }}
              theme={(theme) => ({
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: "var(--green-color)",
                  primary: "black",
                },
              })}
            />
            <AnimatePresence>
              {formErrors.technologies && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 }} // Add a delay before exit animation
                >
                  <VscError /> {formErrors.technologies}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {/* link */}
          <div className={styles.formGroup}>
            <input
              type="text"
              name=""
              id="link"
              autoComplete="off"
              required
              placeholder="https://github.com/..."
              value={form.projectLink || ""}
              onChange={(e) => {
                setField("projectLink", e.target.value),
                  validateField("projectLink", e.target.value);
              }}
            />
            <AnimatePresence>
              {formErrors.projectLink && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 }} // Add a delay before exit animation
                >
                  <VscError /> {formErrors.projectLink}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="select" className={styles.select}>
              Upload 2 Images Here
            </label>
            <p>
              The first image will be used as the cover photo the second will be
              used as the project display
            </p>
            <Dropzone
              files={files}
              setFiles={setFiles}
              displayFiles={displayFiles}
              setDisplayFiles={setDisplayFiles}
            />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.btnGroup}>
              <button type="submit">
                {isLoading ? <CircularBar /> : "Edit Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p>You are not allowed to Perform any operation in this page 🫠</p>
  );
}

export default EditProjectForm;
