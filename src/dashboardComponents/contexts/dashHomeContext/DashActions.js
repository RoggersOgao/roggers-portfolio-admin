import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dsAddUser = (item) => {
  return {
    type: "ADD_USER",
    payload: item,
  };
};
export const dsFetchSession = (item) => {
  return {
    type:"FETCH_SESSION",
    payload:item
    }
}
export const dsFetchUser = (item) => {
  return {
    type: "FETCH_USER",
    payload: item,
  };
};

export const dsUpdateUser = (item) => {
  return {
    type: "UPDATE_USER",
    payload: item,
  };
};
export function dsRemoveUser(itemId) {
  return {
    type: "REMOVE_USER",
    payload: item,
  };
}
export function dsClearUser() {
  return {
    type: "CLEAR_USER",
  };
}

export const fetchProjects = async() => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/project`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    return(err);
  }
}
export const fetchDesigns = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/design`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    return(err);
  }
}

export const fetchUser = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/users`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    return(err);
  }
};
export const fetchGoogleUsers = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/googleoauthusers`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    return(err);
  }
};
export const fetchGithubUsers = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/githuboauthusers`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    return(err);
  }
};

