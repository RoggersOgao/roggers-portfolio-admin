"use server"

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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formUpload),
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
  }catch(error){
    return error
  }
}

export async function AddNewUser(form){

  const userData = {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role
  }
  try {
    const response = await fetch(`${process.env.API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    if (response.status === 201) {
      const data = await response.json();
      console.log("Uploaded successfully!", response.status);
      return { status: response.status, data };
    } else {
      // Return an object with a consistent structure
      return {
        message: response.status === 409 ? "The user already exists!" : "Something went wrong!",
        status: response.status,
      };
    }
  } catch (err) {
    console.error("Upload error:", err);
    return {
      message: "An error occurred during upload.",
      status: 500, // Internal Server Error
    };
  }
  
}
  