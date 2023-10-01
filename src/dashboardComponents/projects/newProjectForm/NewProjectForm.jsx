"use client";
import React, { useState, useRef } from "react";
import styles from "./NewProjectForm.module.scss";
import Dropzone from "./dropzone/Dropzone";
import { tech } from "./technologies";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { uploadProjectData } from "@/dashboardComponents/contexts/projectContext/projectActions";
import { AnimatePresence, motion } from "framer-motion";
import { VscError } from "react-icons/vsc";
import { PiSpinnerLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import CircularBar from "@/dashboardComponents/spinners/circularSpinner/CircularBar";

const animatedComponents = makeAnimated();

function NewProjectForm({session}) {
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);
  const [techl, setTechl] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const formRef = useRef();
  const selectRef = useRef(null);
  const router = useRouter();

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
        if (!value.length) {
          errors.technologies = "Languages used cannot be empty!";
        } else {
          delete errors.technologies;
        }
        break;

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

  // console.log(formErrors);
  const handleSelect = (e) => {
    setTechl(e);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length !== 2) {
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
    try {
      setIsLoading(true);
      const response = await uploadProjectData(formData);
      console.log(response)
      setForm([]);
      setFiles([]);
      selectRef.current.clearValue();
      formRef.current.reset();
      setIsLoading(false);
      let messageToDisplay;

      if (response.data && response.data.message) {
        messageToDisplay = response.data.message;
      } else {
        messageToDisplay = response;
      }


      toast.success(messageToDisplay, {
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
      console.log(err);
      toast.error(err.message, {
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

  return session.user.role == "admin" ?(
    <div className={styles.container}>
      <h1 className={styles.projectNameBack}>
        Pro
        <br />
        ject
      </h1>
      <div className={styles.formContainer}>
      
        <div className={styles.title}>
          <h1>New Project</h1>
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
              value={form.projectName || ""}
              required
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
              value={form.projectDescription || ""}
              required
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
              value={techl}
              options={tech}
              required
              isMulti
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
            <Dropzone files={files} setFiles={setFiles} />
          </div>
          <div className={styles.formGroup}>
            <div className={styles.btnGroup}>
              <button type="submit">
                {isLoading ? <CircularBar /> : "Publish"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p>You are not allowed to view this page.....🫠 </p>
  );
}

export default NewProjectForm;
