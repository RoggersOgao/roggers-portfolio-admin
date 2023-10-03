"use server";
import "react-toastify/dist/ReactToastify.css";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";

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
    console.log(err);
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
      // console.log(uploadDir)
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
    // console.log(designData)

    try {
      const response = await fetch(`${process.env.API_URL}/api/design?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designData),
      });
    
      if (response.status === 200) {
        const data = await response.json();
        console.log("Uploaded successfully!", response.status);
        return { status: response.status, data };
      } else {
        const errorText = await response.text();
        console.error("Upload error:", errorText);
        return errorText;
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

export const uploadDesignData = async (formData) => {
  try {
    const newFiles = await uploadPhotoToLocalStorage(formData);

    // console.log(newFiles)
    const photo = await uploadPhotosToCloudinary(newFiles);
    // console.log(photo)
    await Promise.all(newFiles.map((file) => fs.unlink(file.filepath)));
    // console.log(photo[0])
    const designData = {
      design: photo[0],
      description: formData.get("description"),
    };
    // console.log(designData)

    try {
      const response = await fetch(`${process.env.API_URL}/api/design`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designData),
      });
    
      if (response.status === 201) {
        const data = await response.json();
        console.log("Uploaded successfully!", response.status);
        return { status: response.status, data };
      } else {
        // Use curly braces to return an object
        return {
          message: response.status === 409 ? "The user design exists!" : "Something went wrong!",
          status: response.status,
        };
      }
    } catch (error) {
      console.error("Upload error:", error);
    }    
  } catch (err) {
    console.error(err);
  }

};


export async function deleteDesign(id, design_public_id) {
  try {
    // First, delete the Cloudinary resource
    await cloudinary.v2.uploader.destroy(design_public_id);

    // Then, make the DELETE request using fetch
    const response = await fetch(`${process.env.API_URL}/api/design?id=${id}`, {
      method: 'DELETE',
    });

    if (response.status === 200) {
      revalidatePath("/");
      const data = await response.json();
      return { message: data.message };
    } else {
      throw new Error(`API request failed with status ${response.status}`);
    }
  } catch (error) {
    return { message: error.message };
  }
}
