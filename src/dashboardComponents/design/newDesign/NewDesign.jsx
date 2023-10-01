"use client";
import React, { useState, useRef, useContext } from "react";
import styles from "./NewDesign.module.scss";
import Dropzone from "./dropzone/Dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { VscError } from "react-icons/vsc";
import { PiSpinnerLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { uploadDesignData } from "@/dashboardComponents/contexts/designContext/designActions";
import DesignContext from "@/dashboardComponents/contexts/designContext/DesignContext";
import { AddDesign } from "@/dashboardComponents/contexts/designContext/dispatchDesignActions";
import CircularBar from "@/dashboardComponents/spinners/circularSpinner/CircularBar";

function NewDesign({ session }) {
  const { state, dispatch } = useContext(DesignContext);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState([]);
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
      case "description":
        if (!value) {
          errors.description = "description is required!";
        } else if (value.length < 10 || value.length > 60) {
          errors.description =
            "Design description cannot exceed (100) characters or be less than (10) characters";
        } else {
          delete errors.description;
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length !== 1) {
      alert("Please upload exactly one image☠️.");
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("description", form.description);

    try {
      setIsLoading(true);
      const response = await uploadDesignData(formData);
      let messageToDisplay;

      if (response.data && response.data.message) {
        messageToDisplay = response.data.message;
      } else {
        messageToDisplay = response;
      }
      // dispatch(AddDesign(response.data.message));
      setForm([]);
      setFiles([]);
      formRef.current.reset();
      setIsLoading(false);
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

      router.push("/dashboard/design");
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
      setIsLoading(false);
    }
  };

  return session.user.role == "admin" ? (
    <div className={styles.container}>
      <h1 className={styles.projectNameBack}>
        des
        <br />
        ign
      </h1>
      <div className={styles.formContainer}>
        {/* <ToastContainer style={{ fontSize: "14px", marginTop:"5rem" }} /> */}
        <div className={styles.title}>
          <h1>New Design</h1>
          <Link href="/dashboard/design">
            <button>Back</button>
          </Link>
        </div>
        <form className={styles.form} onSubmit={handleUpload} ref={formRef}>
          {/* dropzone */}
          <div className={styles.formGroup}>
            <label htmlFor="select" className={styles.select}>
              Upload an Image Here
            </label>
            <p>
              This images will be used as both the cover and the display image
            </p>
            <Dropzone files={files} setFiles={setFiles} />
          </div>

          {/* description */}
          <div className={styles.formGroup}>
            <textarea
              id="description"
              autoComplete="off"
              placeholder="Description"
              value={form.description || ""}
              required
              onChange={(e) => {
                setField("description", e.target.value),
                  validateField("description", e.target.value);
              }}
            />
            <AnimatePresence>
              {formErrors.description && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 }} // Add a delay before exit animation
                >
                  <VscError /> {formErrors.description}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.btnGroup}>
              <button type="submit">
                {isLoading ? <CircularBar /> : "Publish Design"}
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

export default NewDesign;
