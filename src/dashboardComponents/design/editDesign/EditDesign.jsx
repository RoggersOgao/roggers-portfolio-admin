"use client";
import React, { useState, useRef, useContext, useEffect } from "react";
import styles from "./EditDesign.module.scss"
import Dropzone from "./dropzone/Dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { VscError } from "react-icons/vsc";
import { PiSpinnerLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { updateDesign, uploadDesign } from "@/dashboardComponents/contexts/designContext/designActions";
import DesignContext from "@/dashboardComponents/contexts/designContext/DesignContext";
import { AddDesign } from "@/dashboardComponents/contexts/designContext/dispatchDesignActions";
import CircularBar from "@/dashboardComponents/spinners/circularSpinner/CircularBar";


function EditDesign({designData, session, designPhoto_public_id}) {
  const { state, dispatch} = useContext(DesignContext)
  const [form, setForm] = useState({});
  const [displayFiles, setDisplayFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef();
  const router = useRouter();
  const setField = (value, field) => {
    setForm({
      ...form,
      [value]: field,
    });
  };

  
  // console.log(designPhoto_public_id[0])
  // getting fetched data to display inside the forms
  // console.log(designData)
  useEffect(() => {
    // Update the form state with the description from designData
    router.refresh()
    setForm({
      description: designData.description,
    });
    // Create a Set to remove duplicates from the 'files' array
    const uniqueFiles = new Set(files);
    setFiles([...uniqueFiles]);
  
    // Combine 'files' and 'designData.design' arrays, then remove duplicates
    const combinedFiles = [...files, ...designData.design];
    const uniqueCombinedFiles = Array.from(new Set(combinedFiles));
    setDisplayFiles(uniqueCombinedFiles);
  }, []);
  

  // validation of the fields

  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case "description":
        if (!value) {
          errors.description = "description is required!";
        } else if (value.length < 10 || value.length > 60) {
          errors.description = "Design description cannot exceed (100) characters or be less than (10) characters";
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
    if (
      (files.length > 0 && files.length !== 1) ||
      (files.length === 0 && displayFiles.length !== 1)
    ) {
      alert("Please upload exactly one image☠️.");
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("description", form.description);

    // Identifying which images are alread associated with the project
    // Identifying which images are already associated with the project
    const existingImageFilenames = [
      ...designData.design.map((img) => img.original_filename),
    ];

    console.log("existingImageFilenames:", existingImageFilenames);
    // console.log("files:", files);
    const newFiles = files.filter(
      (file) => !existingImageFilenames.includes(file.name)
    );
    // console.log("newFiles:", newFiles);



    try {
      // console.log("hasNewImages:", newFiles.length > 0);
      setIsLoading(true);

      // update data function
      const response = await updateDesign(designData._id, formData, newFiles.length > 0, designPhoto_public_id[0])
      console.log(response)
      setForm([]);
      setFiles([]);
      setDisplayFiles([]);
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
      
      router.push("/dashboard/design");
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
      setIsLoading(false);
    }
  };

  return session.user.role == "admin" ?(
    <div className={styles.container}>
      <h1 className={styles.projectNameBack}>
        des
        <br />
        ign
      </h1>
      <div className={styles.formContainer}>
        {/* <ToastContainer style={{ fontSize: "14px", marginTop:"5rem" }} /> */}
        <div className={styles.title}>
          <h1>Update Design</h1>
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
              The first image will be used as the cover photo the second will be
              used as the project display
            </p>
            <Dropzone files={files} setFiles={setFiles} 
            displayFiles={displayFiles}
            setDispalyFiles={setDisplayFiles}
            />
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
  ): (
    <p>You are not allowed to view this page.....🫠 </p>
  );
}

export default EditDesign;
