import React, { useEffect, useState, useRef, useContext, useMemo } from "react";
import styles from "./Profile.module.scss";
import { PiCaretUpDownBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { VscError } from "react-icons/vsc";
import Image from "next/image";
import Dropzone from "./dropzone/Dropzone";
import SettingsContext from "@/dashboardComponents/contexts/settingsContext/SettingsContext";
import { updateUserWithoutImage } from "@/dashboardComponents/contexts/settingsContext/settingsActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularBar from "@/dashboardComponents/spinners/circularSpinner/CircularBar";
import { isVisible } from "@/dashboardComponents/contexts/settingsContext/dispatchSettingsActions";
function Profile() {
  const { data: session } = useSession();
  const { state, dispatch } = useContext(SettingsContext);
  const [roleDropdownActive, setRoleDropdownActive] = useState(false);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [displayFiles, setDisplayFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // console.log(session)
  const roleRef = useRef();

  const userData = useMemo(() => {
    if (session) {
      const { user } = session;
      const { personalInfo, socials } = user;

      return {
        name: user.name || "",
        email: user.email || "",
        location: personalInfo?.[0]?.location || "",
        company: personalInfo?.[0]?.company || "",
        bio: personalInfo?.[0]?.bio || "",
        linkedIn: socials?.[0]?.linkedIn || "",
        twitter: socials?.[0]?.twitter || "",
        github: socials?.[0]?.github || "",
        instagram: socials?.[0]?.instagram || "",
        facebook: socials?.[0]?.facebook || "",
        role: user.role || "",
      };
    }

    // Return default values or an empty object when session is not available.
    return {};
  }, [session]);

  useEffect(() => {
    setForm({
      name: userData.name,
      email: userData.email,
      location: userData.location,
      company: userData.company,
      bio: userData.bio,
      linkedIn: userData.linkedIn,
      twitter: userData.twitter,
      github: userData.github,
      instagram: userData.instagram,
      facebook: userData.facebook,
      role: userData.role,
    });
  }, [userData, setForm]);

  // ...

  // Use userData in your component instead of directly using session.

  // handle click outside logic using useEffect
  useEffect(() => {
    const handleClickOutside = (e) => {
      const handler = roleRef.current && roleRef?.current?.contains(e.target);

      if (!handler) {
        setRoleDropdownActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // getting all the field name and properties using setField

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case "name":
        if (!value) {
          errors.name = "Name is required";
        } else if (value.length > 60) {
          errors.name = "Name cannot exceed 60 characters";
        } else {
          delete errors.name;
        }
        break;
      case "email":
        if (!value) {
          errors.email = "Email is required";
        } else if (!value.match(/^\S+@\S+\.\S+$/)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email; // Clear the error if the field is valid
        }
        break;
      case "location":
        if (value.length > 60) {
          errors.location =
            "Location details should be less than 60 characters";
        } else {
          delete errors.location;
        }
        break;
      case "company":
        if (value.length > 60) {
          errors.company = "Company name should be less than 60 characters";
        } else {
          delete errors.company;
        }
        break;
      case "linkedIn":
      case "facebook":
      case "instagram":
      case "twitter":
      case "github":
        if (value.length > 0 && !isValidSocialMediaURL(value)) {
          errors[
            name
          ] = `Please provide a valid link, e.g. https://www.${name}.com/...`;
        } else {
          delete errors[name]; // Clear the error if the field is valid
        }
        break;

      case "bio":
        if (value.length > 600) {
          errors.bio = "Bio must be less 600 characters";
        } else {
          delete errors.bio; // Clear the error if the field is valid
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const isValidSocialMediaURL = (url) => {
    const socialMediaPatterns = {
      linkedIn: /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
      twitter: /^(https?:\/\/)?(www\.)?twitter\.com\/.*$/,
      github: /^(https?:\/\/)?(www\.)?github\.com\/.*$/,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.*$/,
      facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.*$/,
    };
    for (const platform in socialMediaPatterns) {
      if (url.match(socialMediaPatterns[platform])) {
        return true;
      }
    }

    return false;
  };

  // updating the form field role
  const handleActiveRole = (name) => {
    setField("role", name);
  };

  const userId = session?.user?._id;

  // Handling the submission of the form...
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateUserWithoutImage(userId, form);
      console.log(response);
      setIsLoading(false);
      router.refresh();
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      toast.success(err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const handleUpdateImage = async (e) => {
    e.preventDefault();

    if(state.files.length > 0){
      // ill update the code for this much later.....
    }

  };

  console.log(state)
  return (
    <div className={styles.container}>
      <ToastContainer style={{ fontSize: "14px", marginTop: "5rem" }} />
      <div className={styles.profile}>
        <form className={styles.profileForm} onSubmit={handleUpdateProfile}>
          <div className={styles.profileLeft}>
            <div className={styles.cont}>
              {/* full name */}
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name*</label>
                <input
                  type="text"
                  id="name"
                  placeholder="eg. Roggers Ogao"
                  style={{ border: formErrors.name ? ".3px solid red" : "" }}
                  autoComplete="off"
                  value={form?.name || ""}
                  onChange={(e) => {
                    setField("name", e.target.value),
                      validateField("name", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.name && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* email */}
              <div className={styles.formGroup}>
                <label htmlFor="email">Email*</label>
                <input
                  type="text"
                  id="email"
                  placeholder="eg. example@xyz.com"
                  autoComplete="off"
                  style={{ border: formErrors.email ? ".3px solid red" : "" }}
                  value={form?.email || ""}
                  onChange={(e) => {
                    setField("email", e.target.value),
                      validateField("email", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.email && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.email}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* location */}
              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  placeholder="eg. Nairobi"
                  id="location"
                  autoComplete="off"
                  value={form?.location || ""}
                  style={{
                    border: formErrors.location ? ".3px solid red" : "",
                  }}
                  onChange={(e) => {
                    setField("location", e.target.value),
                      validateField("location", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.location && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.location}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* company */}
              <div className={styles.formGroup}>
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  placeholder="eg. intellisirn"
                  id="company"
                  value={form?.company || ""}
                  autoComplete="off"
                  style={{ border: formErrors.company ? ".3px solid red" : "" }}
                  onChange={(e) => {
                    setField("company", e.target.value),
                      validateField("company", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.company && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.company}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* linkend in */}
              <div className={styles.formGroup}>
                <label htmlFor="linkedin">Linked In</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/..."
                  id="linkedin"
                  autoComplete="off"
                  value={form?.linkedIn || ""}
                  style={{
                    border: formErrors.linkedIn ? ".3px solid red" : "",
                  }}
                  onChange={(e) => {
                    setField("linkedIn", e.target.value),
                      validateField("linkedIn", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.linkedIn && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.linkedIn}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* twitter */}
              <div className={styles.formGroup}>
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/..."
                  id="twitter"
                  autoComplete="off"
                  value={form?.twitter || ""}
                  style={{ border: formErrors.twitter ? ".3px solid red" : "" }}
                  onChange={(e) => {
                    setField("twitter", e.target.value),
                      validateField("twitter", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.twitter && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.twitter}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* instagram */}
              <div className={styles.formGroup}>
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/..."
                  id="instagram"
                  autoComplete="off"
                  value={form?.instagram || ""}
                  style={{
                    border: formErrors.instagram ? ".3px solid red" : "",
                  }}
                  onChange={(e) => {
                    setField("instagram", e.target.value),
                      validateField("instagram", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.instagram && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.instagram}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* facebook */}
              <div className={styles.formGroup}>
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="text"
                  placeholder="https://facebook.com/..."
                  id="facebook"
                  autoComplete="off"
                  value={form?.facebook || ""}
                  style={{
                    border: formErrors.facebook ? ".3px solid red" : "",
                  }}
                  onChange={(e) => {
                    setField("facebook", e.target.value),
                      validateField("facebook", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.facebook && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.facebook}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* github */}
              <div className={styles.formGroup}>
                <label htmlFor="github">github</label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  id="github"
                  autoComplete="off"
                  value={form?.github || ""}
                  style={{ border: formErrors.github ? ".3px solid red" : "" }}
                  onChange={(e) => {
                    setField("github", e.target.value),
                      validateField("github", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.github && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.github}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* role */}
                    {session?.user?.role == "admin" && (
                      <div className={styles.dropdownContainer} ref={roleRef}>
                <label htmlFor="role">Role</label>
                <div className={styles.dropdown}>
                  <button
                    htmlFor="role"
                    type="button"
                    onClick={() => {
                      setRoleDropdownActive(!roleDropdownActive);
                    }}
                  >
                    Role ({form?.role ? form?.role : "user"})
                    <PiCaretUpDownBold />
                  </button>
                  <AnimatePresence>
                  {roleDropdownActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 0.3 }}
                        className={styles.dropdownList}
                      >
                        <ul>
                          <motion.li
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.3 }} // Add a delay before exit animation
                            onClick={(e) => handleActiveRole("user")}
                          >
                            User
                          </motion.li>
                          <motion.li
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.3 }}
                            onClick={(e) => handleActiveRole("admin")}
                          >
                            Admin
                          </motion.li>
                        </ul>
                      </motion.div>
                  )}
                    </AnimatePresence>
                </div>
              </div>
                    )}
              
              {/* bio */}
              <div className={styles.formGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  placeholder="write something short about yourself"
                  autoComplete="off"
                  value={form?.bio || ""}
                  style={{ border: formErrors.bio ? ".3px solid red" : "" }}
                  onChange={(e) => {
                    setField("bio", e.target.value),
                      validateField("bio", e.target.value);
                  }}
                />
                <AnimatePresence>
                  {formErrors.bio && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.bio}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              {/* button */}
              <div className={styles.formGroup}>
                <div className={styles.button}>
                  <button type="submit">
                    {isLoading ? <CircularBar /> : "Update Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className={styles.uploadPhotoContainer}>
          <form className={styles.profileRight}>
            <div className={styles.profileRightTitle}>
              <h1>Your photo</h1>
              {session?.user?.role == "admin" && (
              <div className={styles.addButton}>
                <button type="button" onClick={() => dispatch(isVisible())}>Add New User</button>
              </div>
              )}
            </div>
            <div className={styles.profileAvatarContainer}>
              <div className={styles.profileAvatarContainerTop}>
                <div className={styles.profileAvatarContainerTopLeft}>
                  {state.file.length > 0 ? (
                    state.file.map((file, index) => (
                      <div className={styles.imgCont} key={index}>
                        <Image
                          src={file.preview ? file.preview : file.secure_url}
                          alt={`Image ${index + 1}`} // You might want to add a meaningful alt text
                          width={100}
                          height={100}
                          className={styles.avatar}
                          loading="lazy"
                        />
                      </div>
                    ))
                  ) : (
                    <div className={styles.imgCont} key={0}>
                      {session ? (
                        session?.user?.image ? (
                          <Image
                            src={session?.user?.image}
                            alt="profile picture"
                            width={200}
                            height={200}
                            quality={100}
                            className={styles.avatar}
                          />
                        ) : (
                          <Image
                            src="/assets/abstract-colorful-splash-3d-background-generative-ai-background.jpg"
                            alt="profile picture (image)"
                            width={200}
                            height={200}
                            quality={100}
                            unoptimized={true}
                            className={styles.image}
                          />
                        )
                      ) : (
                        <div className={styles.loadingUserImage}></div>
                      )}
                    </div>
                  )}
                </div>

                <div className={styles.profileAvatarContainerTopRight}>
                  <div className={styles.top}>
                    <h3>Edit your photo</h3>
                  </div>
                  <div className={styles.bottom}>
                    {session ? (
                      <>
                        <div className={styles.button1}>
                          <button type="submit" disabled onSubmit={handleUpdateImage}>
                            Update
                          </button>
                        </div>
                        <div className={styles.button2}>
                          <button disabled type="button">Delete</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.btn1}></div>
                        <div className={styles.btn2}></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.profileAvatarContainerBottom}>
                <Dropzone
                  files={files}
                  setFiles={setFiles}
                  displayFiles={displayFiles}
                  setDisplayFiles={setDisplayFiles}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
