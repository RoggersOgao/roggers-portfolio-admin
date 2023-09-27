"use client";
import React, { useCallback, useState, useEffect, useContext } from "react";
import styles from "./Dropzone.module.scss";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { AiOutlineCloseCircle, AiFillFileExcel } from 'react-icons/ai'
import { PiUploadLight } from 'react-icons/pi'
import { GrFormClose } from 'react-icons/gr'
import { addFile } from "@/dashboardComponents/contexts/settingsContext/dispatchSettingsActions";
import SettingsContext from "@/dashboardComponents/contexts/settingsContext/SettingsContext";

// const imageValidator = (file) => {
//   const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

//   if (!allowedTypes.includes(file.type)) {
//     return false;
//   }

//   const blob = new Blob([file], { type: file.type });
//   const reader = new FileReader();

//   reader.readAsDataURL(blob);

//   return new Promise((resolve) => {
//     reader.onloadend = () => {
//       const dataURL = reader.result;

//       const img = document.createElement("img");
//       img.src = dataURL;

//       img.onload = () => {
//         if (img.width === 0 || img.height === 0) {
//           resolve({
//             code: "file-not-image",
//             message: "This file is not an image",
//           });
//         } else {
//           resolve(null);
//         }
//       };
//     };
//   });
// };


function Dropzone({files, setFiles, displayFiles, setDisplayFiles}) {

  const [rejected, setRejected] = useState([])
  const {state, dispatch} = useContext(SettingsContext)

  files = files.length === 0 ? displayFiles : files;
  
  useEffect(()=>{
    dispatch(addFile(files))
  },[files,dispatch])
//   generating a preview url for uploaded images
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((prev) => [
        // ...prev,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
    //   saving the rejected files in my state 
    if(rejectedFiles?.length){
        setRejected((prev)=>[
            ...prev,
            ...rejectedFiles
        ])
    }
  }, []);

  ///revoking data urls to avoid memory leaks 
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

//   functionallity to remove accepted files

const removeFile = (name) => {
    setFiles(files => files.filter((file)=> file.name !== name))
    setDisplayFiles(files => files.filter((file)=> file.original_filename !== name))
}

// functioanility to remove rejected files3
const removeRejected = (name) => {
    setRejected(rejected => rejected.filter(({file})=> file.name !== name))
}

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
     onDrop,
     multiple: true,
    //  maxFiles:1,
    //  validator:imageValidator,
    disabled:true,
     accept: {
        'image/*': ['.jpeg', '.png', ".jpg"]
      }
     });

//   size converter
    const convertToKibOrMib = (sizeInBytes) => {
      const kibSize = (sizeInBytes / 1024).toFixed(2);
      const mibSize = (sizeInBytes / (1024 * 1024)).toFixed(2);
  
      if (mibSize >= 1) {
        return `${mibSize} MiB`;
      } else {
        return `${kibSize} KiB`;
      }
    };
  return (
    <div className={styles.container}>
      <div
        {...getRootProps({
          className: styles.dropzoneContainer,
        })}
      >
        <input {...getInputProps()} />
        {isDragAccept && (<p>All files will be accepted</p>)}
        {isDragReject && (<p>Some files will be rejected</p>)}
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
            <>
            <i><PiUploadLight /></i>
          <p><span>Click to upload</span> or drag and drop <br/>, PNG, JPEG, JPG <br/> (dropzone disabled 🫠 you don&apos;t need it )</p>
          </>
        )}
      </div>
      <div className={styles.previewContainer}>
      
        {/* rejected files section */}

        <ul className={styles.rejected}>
            <h2>Rejected Files</h2>
            {rejected.map(({file,errors}, index)=>(
                <div className={styles.rejectCont} key={index}>
                    <li>
                        <div className={styles.rejectedContainer}>
                        <div className={styles.left}>
                        <div className={styles.file}>
                        <AiFillFileExcel className={styles.icon}/>
                        </div>
                        <div className={styles.errors}>
                            <p>{file.name}</p>
                            {errors.map((error,index)=>(
                                <p key={index}>{error.message}</p>
                            ))}
                        </div>
                        </div>
                        <div className={styles.right}>
                            <button onClick={()=> removeRejected(file.name)}><GrFormClose className={styles.icon} />remove</button>
                        </div>
                        </div>
                    </li>
                </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Dropzone;
