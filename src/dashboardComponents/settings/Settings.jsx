"use client";
import React, { useContext, useRef, useEffect, useState } from "react";
import styles from "./Settings.module.scss";
import { FaGithub, FaHome, FaMapMarkedAlt } from "react-icons/fa";
import Image from "next/image";
import img1 from "../../../public/assets/abstract-colorful-splash-3d-background-generative-ai-background.jpg";
import SettingsContext from "@/dashboardComponents/contexts/settingsContext/SettingsContext";
import {
  BiLogoFacebook,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoTwitter,
} from "react-icons/bi";
import Account from "./account/Account";
import { PiCaretUpDownBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { isHidden } from "../contexts/settingsContext/dispatchSettingsActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscError } from "react-icons/vsc";
import CircularBar from "../spinners/circularSpinner/CircularBar";
import { AddNewUser } from "../contexts/settingsContext/settingsActions";
const renderLocationCompany = (info) => (
  <>
    <div className={styles.location}>
      <div className={styles.locationLeft}>
        <p className={styles.locationHeading}>Location</p>
        <p className={styles.locationText}>
          {info.location.length > 16
            ? `${info.location.slice(0, 16)}...`
            : info.location || "Nairobi"}
        </p>
      </div>
      <div className={styles.locationRight}>
        <FaMapMarkedAlt className={styles.icon} />
      </div>
    </div>
    <div className={styles.company}>
      <div className={styles.companyLeft}>
        <p className={styles.companyHeading}>Company</p>
        <div className={styles.companyText}>
          {info.company.length > 16
            ? `${info.company.slice(0, 16)}...`
            : info.company}
        </div>
      </div>
      <div className={styles.companyRight}>
        <FaHome className={styles.icon} />
      </div>
    </div>
  </>
);

function Settings({session}) {
  const { state, dispatch } = useContext(SettingsContext);
  const [roleDropdownActive, setRoleDropdownActive] = useState(false);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const roleRef = useRef();
  const addUserContainerRef = useRef();

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  useEffect(() => {

    if (state.isVisible) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'auto';   // Enable scrolling
    }
    const handleClickOutside = (e) => {
      const handler = roleRef.current && roleRef?.current?.contains(e.target);
      const handleClickOutsideAddUserContainer =
        addUserContainerRef.current &&
        addUserContainerRef?.current?.contains(e.target);

      if (!handler) {
        setRoleDropdownActive(false);
      }
      if (!handleClickOutsideAddUserContainer) {
        dispatch(isHidden());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'auto';   // Clean up when unmounting
    };
  }, [state.isVisible]);
  // updating the form field role
  const handleActiveRole = (name) => {
    setField("role", name);
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
      case "password":
        if (!value) {
          errors.password = "Password is required";
        } else if (value.length < 8) {
          errors.password = "Password must be at least 8 characters long";
        } else if (!/[A-Z]/.test(value)) {
          errors.password = "Password must contain at least one capital letter";
        } else if (!/\d/.test(value)) {
          errors.password = "Password must contain at least one number";
        } else {
          delete errors.password;
          // Check if "repeat password" field matches
          if (value !== form.repeatPassword) {
            errors.repeatPassword = "Passwords do not match";
          } else {
            delete errors.repeatPassword;
          }
        }
        break;

      case "repeatPassword":
        if (!value) {
          errors.repeatPassword = "Repeat Password is required";
        } else if (value !== form.password) {
          errors.repeatPassword = "Passwords do not match";
        } else {
          delete errors.repeatPassword;
        }
        break;
      default:
        break;
    }
    setFormErrors(errors)
  };

  const handleAddUser = async(e) => {
    e.preventDefault()

    try{
      setIsLoading(true)
      const response = await AddNewUser(form)
      setIsLoading(false)
      setForm([])
      toast.success(response, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }catch(err){
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
  }
  return (
    <div className={styles.container}>
      {session?.user.role == "admin" && (
        <AnimatePresence>
        {state.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.addUserContainer}
          >
            <ToastContainer style={{ fontSize: "14px", marginTop: "5rem" }} />
            <div className={styles.formContainer}>
              <form className={styles.form} ref={addUserContainerRef} onSubmit={handleAddUser}>
                <div
                  className={styles.closeButton}
                  onClick={() => dispatch(isHidden())}
                >
                  <AiOutlineCloseCircle />
                </div>
                {/* name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    required
                    autoComplete="off"
                    style={{ border: formErrors.name ? ".3px solid red" : "" }}
                    value={form?.name || ""}
                    onChange={(e)=> { setField("name", e.target.value), validateField("name", e.target.value)}}
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
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="JohnDoe@example.com"
                    required
                    style={{ border: formErrors.email ? ".3px solid red" : "" }}
                    autoComplete="off"
                    value={form?.email || ""}
                    onChange={(e)=> { setField("email", e.target.value), validateField("email", e.target.value)}}
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
                {/* password */}
                <div className={styles.formGroup}>
                  <label htmlFor="password">password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="********"
                    required
                    style={{ border: formErrors.password ? ".3px solid red" : "" }}
                    value={form?.password || ""}
                    onChange={(e)=> { setField("password", e.target.value), validateField("password", e.target.value)}}
                  />
                  <AnimatePresence>
                  {formErrors.password && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.password}
                    </motion.span>
                  )}
                </AnimatePresence>
                </div>
                {/* repeat password */}
                <div className={styles.formGroup}>
                  <label htmlFor="repeatPassword">Repeat Password</label>
                  <input
                    type="password"
                    id="repeatPassword"
                    placeholder="********"
                    style={{ border: formErrors.repeatPassword ? ".3px solid red" : "" }}
                    required
                    value={form?.repeatPassword || ""}
                    onChange={(e)=> { setField("repeatPassword", e.target.value), validateField("repeatPassword", e.target.value)}}
                  />
                  <AnimatePresence>
                  {formErrors.repeatPassword && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.3 }} // Add a delay before exit animation
                    >
                      <VscError /> {formErrors.repeatPassword}
                    </motion.span>
                  )}
                </AnimatePresence>
                </div>
                {/* role */}
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

                <div className={styles.formGroup}>
                  <div className={styles.buttonGroup}>
                    <button type="submit">{isLoading ? <CircularBar /> : "Publish user"}</button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}
      
      <div className={styles.profile}>
        <div className={styles.profileHeader}>
          {/* first row */}
          <div className={styles.profileHeaderRow1}>
            {/* <Link href="/dashboard/settings" className={styles.back}>
              <FaArrowLeft /> &nbsp; Back
            </Link> */}

            {state.file.length > 0 ? (
              state.file.map((file, index) => (
                <div className={styles.avatCont} key={index}>
                  <Image
                    src={file.preview ? file.preview : file.secure_url}
                    alt={`Image ${index + 1}`} // You might want to add a meaningful alt text
                    width={100}
                    height={100}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div className={styles.avatarText}>
                    <p className={styles.name}>
                      {session?.user.name ? session?.user.name : "John Doe"}
                    </p>
                    <p className={styles.username}>
                      {session?.user.email
                        ? session?.user.email
                        : "someone@example.com"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.avatCont} key={0}>
                {session ? (
                  session?.user?.image ? (
                    <>
                      <Image
                        src={session?.user?.image}
                        alt="image2"
                        width={600}
                        height={600}
                        className={styles.avatar}
                        loading="lazy"
                      />
                      <div className={styles.avatarText}>
                        <p className={styles.name}>
                          {session?.user.name ? session?.user.name : "John Doe"}
                        </p>
                        <p className={styles.username}>
                          {session?.user.email
                            ? session?.user.email
                            : "someone@example.com"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <Image
                      src={img1}
                      alt="profile picture"
                      width={600}
                      height={600}
                      quality={100}
                      className={styles.avatar}
                    />
                  )
                ) : (
                  <div className={styles.imgLoading}></div>
                )}
              </div>
            )}
          </div>

          {/* second row */}
          <div className={styles.row2}>
            <div className={styles.row2NameContainer}>
              {session?.user.name ? (
                <>
                  <div className={styles.name}>{session?.user.name}</div>
                  <div className={styles.type}>{session?.user.role}</div>
                  <div className={styles.hire}>{session?.user.email}</div>
                </>
              ) : (
                <>
                  <div className={styles.loadingName}></div>
                  <div className={styles.loadingType}></div>
                  <div className={styles.loadingEmail}></div>
                </>
              )}
            </div>

            {session ? (
              <a
                href="https://github.com/RoggersOgao"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.row2GitProfiliLink}
              >
                <div className={styles.row2GitProfiliLinkBio}>
                  <FaGithub size={18} /> &nbsp;&nbsp;Profile
                </div>
              </a>
            ) : (
              <div className={styles.loadingGitProfile}></div>
            )}

            <div className={styles.row2InformationContainer}>
              {session ? (
                session?.user?.personalInfo?.length > 0 ? (
                  session?.user?.personalInfo.map((info, index) => (
                    <div
                      className={styles.row2InformationContainer}
                      key={index}
                    >
                      {renderLocationCompany(info)}
                      <div className={styles.follow}>
                        <p className={styles.followHeading}>Follow Me</p>
                        <div className={styles.followText}>
                          {session?.user?.socials.map((socialLink, index) => (
                            <div className={styles.socialIcons} key={index}>
                              <i>
                                <BiLogoLinkedin />
                              </i>
                              <i>
                                <BiLogoTwitter />
                              </i>
                              <i>
                                <BiLogoFacebook />
                              </i>
                              <i>
                                <BiLogoInstagram />
                              </i>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.row2InformationContainer}>
                    {renderLocationCompany({
                      location: "Location not provided",
                      company: "company not provided",
                    })}
                    <div className={styles.follow}>
                      <p className={styles.followHeading}>Follow Me</p>
                      <div className={styles.followText}>
                        <div className={styles.socialIcons}>
                          <i>
                            <BiLogoLinkedin />
                          </i>
                          <i>
                            <BiLogoTwitter />
                          </i>
                          <i>
                            <BiLogoFacebook />
                          </i>
                          <i>
                            <BiLogoInstagram />
                          </i>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                // Display loading state or provide a default structure
                <div className={styles.row2InformationContainer}>
                  {/* Loading state */}
                  <div className={styles.col1}></div>
                  <div className={styles.col1}></div>
                  <div className={styles.col1}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.accountSettings}>
        <div className={styles.accountSettingsTitle}>
          <h1>Account settings</h1>
        </div>
        <Account session={session} />
      </div>
    </div>
  );
}

export default Settings;
