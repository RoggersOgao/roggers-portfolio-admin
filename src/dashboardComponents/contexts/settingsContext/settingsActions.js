"use server";

import axios from "axios"


const profileAxios = axios.create({
  baseURL: "roggers-portfolio-admin.vercel.app"
})

export async function updateUserWithoutImage(id, form) {

  const formUpload = {
    name: form.name,
    email: form.email,
    socials: [{
      linkedIn: form.linkedIn,
      twitter: form.twitter,
      instagram: form.instagram,
      facebook: form.facebook,
      github: form.github
    }],
    personalInfo: [{
      location: form.location,
      company: form.company,
      bio: form.bio
    }],
    role: form.role   
  };

  try{
    const response = await profileAxios.put(`/api/users?id=${id}`, formUpload)
    return response
  }catch(error){
    console.log(err)
  }
}

export async function AddNewUser (form){

  try{
      const response = await profileAxios.post("/api/auth/signup", form)
      if(response.status === 200){
        return response.data
      }
  }catch(err){
    return err.message
  }
}
  