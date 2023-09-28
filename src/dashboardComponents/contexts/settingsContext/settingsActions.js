import axios from "axios"

const settingsAxios= axios.create({
  baseURL:process.env.API_URL,
  headers:{
    'content-type': 'application/x-www-form-urlencoded',
  }
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
    const response = await settingsAxios.put(`/api/users?id=${id}`, formUpload)
    return response
  }catch(error){
    return error
  }
}

export async function AddNewUser (form){

  try{
      const response = await settingsAxios.post(`/api/auth/signup`, form)
      if(response.status === 200){
        return response.data
      }
  }catch(err){
    return err.message
  }
}
  