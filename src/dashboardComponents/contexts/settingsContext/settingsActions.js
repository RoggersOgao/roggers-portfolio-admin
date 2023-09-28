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
    const response = await fetch(`${process.env.API_URL}/api/users?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formUpload),
    });
    
    if (response.ok) {
      return response;
    } else {
      throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
    }
    
  }catch(error){
    return error
  }
}

export async function AddNewUser (form){

  try{
    const response = await fetch(`${process.env.API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to fetch: ${response.status} - ${response.statusText}`);
    }
    
  }catch(err){
    return err.message
  }
}
  