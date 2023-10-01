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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
};

export const fetchCrUsers = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/signup`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    console.log(err);
  }
}
export const fetchGoogleUsers = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}/api/auth/googleoauthusers`);
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
};



// export const AddUser = async (dispatch, product) => {
//   try {
//     const response = await cartItems.post("/api/carts", product);
//     dispatch(addToCart(response.data));
//     console.log(response);
//     if (response.status === 201) {
//       toast.success("Item added to cart!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "dark",
//       });
//     }
//   } catch (err) {
//     // console.log(err)
//     toast.error("Item already exists!", {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//     });
//   }
//   return null;
// };

// export const updateCartItems = async (dispatch, id) => {
//   try {
//     const response = await cartItems.put(`/api/carts/${id}`, product);
//     dispatch(updateCartItem(response.data));

//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const deleteCartItem = async (dispatch, id) => {
//   try {
//     const response = await cartItems.delete(`/api/carts/${id}`);
//     dispatch(removeFromCart(response.data));

//     return response;
//   } catch (err) {
//     console.log(err);
//   }
// };
