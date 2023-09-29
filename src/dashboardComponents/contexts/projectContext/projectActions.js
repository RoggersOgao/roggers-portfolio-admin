"use server";

import { NextResponse } from "next/server";
import "react-toastify/dist/ReactToastify.css";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import cloudinary from "cloudinary";
import { revalidatePath } from "next/cache";

import axios from "axios";

const projectAxios =axios.create({
  baseURL: "http://localhost:3001"
})
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const fetchProject = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/project`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    return(err);
  }
};

// delay function
const delay = (delaryInms) => {
  return new Promise((resolve) => setTimeout(resolve, delaryInms));
};

export async function getAllPhotos() {
  try {
    const { resources } = await cloudinary.v2.search
      .expression("folder:projects/*")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    return resources;
  } catch (error) {
    NextResponse.json({ msg: error.message }, { status: 500 });
  }
}
async function uploadPhotoToLocalStorage(formData) {
  const files = formData.getAll("files");

  const multipleBufferPromise = files.map((file) =>
    file.arrayBuffer().then((data) => {
      const buffer = Buffer.from(data);
      const name = uuidv4();
      const ext = file.type.split("/")[1];
      const tempdir = os.tmpdir();
      const uploadDir = path.join(tempdir, `/${name}.${ext}`);
      fs.writeFile(uploadDir, buffer);
      return { filepath: uploadDir, filename: file.name };
    })
  );
  return await Promise.all(multipleBufferPromise);
}

async function uploadPhotosToCloudinary(newFiles) {
  const multipleBufferPromise = newFiles.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        file.filepath,
        { folder: "projects" },
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

export const uploadData = async (formData) => {
  try {
    const technologiesArray = formData.getAll("technologies[]");
    const parsedTechnologies = technologiesArray
      .map((jsonString) => {
        try {
          return JSON.parse(jsonString);
        } catch (error) {
          console.error("Parsing error:", error);
          return null;
        }
      })
      .filter(Boolean);

    const newFiles = await uploadPhotoToLocalStorage(formData);
    const photos = await uploadPhotosToCloudinary(newFiles);
    await Promise.all(newFiles.map((file) => fs.unlink(file.filepath)));

    const projectData = {
      projectName: formData.get("projectName"),
      projectDescription: formData.get("projectDescription"),
      technologies: parsedTechnologies,
      projectLink: formData.get("projectLink"),
      coverPhoto: photos[0],
      projectPhoto: photos[1],
    };

    try {
      const response = await projectAxios.post(`/api/project`, projectData);
      if (response.status === 200) {
        return { data: response.data, status: response.status };
      }
    } catch (err) {
      return(err);
    }
  } catch (error) {
    console.error("Upload error:", error);
  }
};

export const fetchProjectById = async (id) => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/project?id=${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (err) {
    return(err);
  }
};

export const updateProject = async (
  id,
  formData,
  hasNewImages = false,
  coverPhoto_public_id,
  projectPhoto_public_id
) => {
  try {
    const technologiesArray = formData.getAll("technologies[]");
    const parsedTechnologies = [];
    technologiesArray.forEach((jsonString) => {
      try {
        const parsedObject = JSON.parse(jsonString);
        parsedTechnologies.push(parsedObject);
      } catch (error) {
        console.error("Parsing error:", error);
      }
    });

    let photos = [];

    if (hasNewImages) {
      const newFiles = await uploadPhotoToLocalStorage(formData);
      photos = await uploadPhotosToCloudinary(newFiles);
      cloudinary.v2.uploader.destroy(coverPhoto_public_id);
      cloudinary.v2.uploader.destroy(projectPhoto_public_id);
      await Promise.all(newFiles.map((file) => fs.unlink(file.filepath)));
    }

    const projectData = {
      projectName: formData.get("projectName"),
      projectDescription: formData.get("projectDescription"),
      technologies: parsedTechnologies,
      projectLink: formData.get("projectLink"),
      // Only update the cover and project photos if new images were uploaded
      ...(hasNewImages && { coverPhoto: photos[0], projectPhoto: photos[1] }),
    };
    // update the project in the database
    try {
      const response = await projectAxios.put(`/api/project?id=${id}`, projectData);
      if (response.status === 200) {
        return { data: response.data, status: response.status };
      }
    } catch (error) {
      console.error("update Error", err.message);
      return error.message;
    }
  } catch (err) {
    return err.message;
  }
};

export async function deleteProject(
  id,
  coverPhoto_public_id,
  projectPhoto_public_id
) {
  try {
    cloudinary.v2.uploader.destroy(coverPhoto_public_id);
    cloudinary.v2.uploader.destroy(projectPhoto_public_id);
    const response = await projectAxios.delete(`/api/project?id=${id}`);
    revalidatePath("/");
    if (response.status === 200) {
      return { msg: response.data };
    }
  } catch (err) {
    return { message: err.message };
  }
}
