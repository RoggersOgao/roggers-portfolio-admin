"use server";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const fetchDesignById = async (id) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/design?id=${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (err) {
    return(err);
  }
};

export const fetchDesign = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/design`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (err) {
    console.error(err);
  }
};

// upload to localStorage
async function uploadPhotoToLocalStorage(formData) {
  const files = formData.getAll("files");

  const multipleBufferPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = uuidv4();
      const ext = file.type.split("/")[1];
      // doest work on vercel
      // console.log({name,ext})
      // const uploadDir = path.join(
      //   process.cwd(),
      //   "public/uploads",
      //   `/${name}.${ext}`
      // );
      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${name}.${ext}`);
      fs.writeFile(uploadDir, buffer);
      return { filepath: uploadDir, filename: file.name };
    })
  );
  return await Promise.all(multipleBufferPromise);
}

// upload to cloudinary

async function uploadPhotosToCloudinary(newFiles) {
  const multipleBufferPromise = newFiles.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        file.filepath,
        { folder: "designs" },
        function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  });

  try {
    const results = await Promise.all(multipleBufferPromise);
    return results;
  } catch (error) {
    throw error;
  }
}
const delay = (delaryInms) => {
  return new Promise((resolve) => setTimeout(resolve, delaryInms));
};
export const uploadDesign = async (formData) => {
  try {
    const newFiles = await uploadPhotoToLocalStorage(formData);
    const photo = await uploadPhotosToCloudinary(newFiles);
    await Promise.all(newFiles.map((file) => fs.unlink(file.filepath)));
    const designData = {
      design: photo[0],
      description: formData.get("description"),
    };

  // Use axios concurrency feature to send POST request
    const [response] = await Promise.all([
      axios.post(`${process.env.API_URL}/api/design`, designData),
    ]);

    if (response.status === 200) {
      return { status: response.status, data: response.data };
    } else {
      console.error("POST request failed with status:", response.status);
      return { status: response.status, error: response.data };
    }
    
  } catch (err) {
    console.error(err);
    return { status: 500, error: "Internal Server Error" };
  }
};


export const updateDesign = async (
  id,
  formData,
  hasNewImages = false,
  design_public_id
) => {
  try {
    let photos = [];
    if (hasNewImages) {
      const newFiles = await uploadPhotoToLocalStorage(formData);
      photos = await uploadPhotosToCloudinary(newFiles);

      // destory the image that was stored on cloudinary if a new images was uploaded
      cloudinary.v2.uploader.destroy(design_public_id);

      // remove the file from our temp dir
      await Promise.all(newFiles.map((file) => fs.unlink(file.filepath)));
    }

    const designData = {
      design: photos[0],
      description: formData.get("description"),
    };

    try {
      const response = await axios.put(
        `${process.env.API_URL}/api/design?id=${id}`,
        designData
      );
      if (response.status == 200) {
        return { status: response.status, data: response.data };
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      return error.message;
    }
  } catch (err) {
    console.error(err.message);
    return err.message;
  }
};

export async function deleteDesign(
  id,
  design_public_id
){
  try{
    cloudinary.v2.uploader.destroy(design_public_id)

    const response = await axios.delete(`${process.env.API_URL}/api/design?id=${id}`)
    revalidatePath("/")
    if (response.status === 200) {
      return { message: response.data.message };
    }
  }catch(error){
    return {message: err.message}
  }
}