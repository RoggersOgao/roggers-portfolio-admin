"use client"
import React, { useState } from 'react'
import styles from "./Login.module.scss"
import Image from 'next/image'
import { SiMailchimp } from 'react-icons/si'
import { FaFingerprint, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from "next-auth/react"
import { BiLoaderCircle } from 'react-icons/bi'
import { useRouter } from 'next/navigation'
import cls from 'classnames'
import Meetup from '../spinners/meetup/Meetup'
import CircularBar from '../spinners/circularSpinner/CircularBar'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Login() {
    
    const [inputFilled, setInputFilled] = useState({})
    const [form, setForm] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [loading, setLoading] = useState({
        googleLoading: false,
        githubLoading: false,
        credentialsLoading:false
    })
    const [passwordVisible, setPasswordVisible] = useState(false)

    const router = useRouter()
    const setField = (field, value) => {
        setForm({
            ...form,
            [field]:value
        })
    }

    const validateField = (name, value) => {
        const errors = { ...formErrors}

        switch(name){
            case 'email':
            if (!value) {
              errors.email = 'Email is required';
            } else if (!value.match(/^\S+@\S+\.\S+$/)) {
              errors.email = 'Please enter a valid email address';
            } else {
              delete errors.email; // Clear the error if the field is valid
            }
            break;
            case "name":
                if(!value){
                    errors.password = "Password is required";
                }else{
                    delete errors.password
                }
        }
        setFormErrors(errors)
    }
   

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(prevState =>({...prevState, credentialsLoading:true}))
        const status = await signIn("credentials",{
            redirect:false,
            email:form.email,
            password:form.password,
            callbackUrl:"/dashboard"
        })
        setLoading(prevState =>({...prevState, credentialsLoading:false}))
        console.log(status)
        if(status.error == null){
            router.push(status.url)
            toast.success("logging in successful! (redirecting...)", {
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
        else{
            toast.error(status.error, {
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
    const handleGoogleLogin = async () => {
        setLoading((prevState) => ({ ...prevState, googleLoading: true }));
        try {
          await signIn("google", { callbackUrl: `/dashboard` });
        } catch (error) {
          console.error("Error during Google login:", error);
          // Handle the error (e.g., show an error message)
        } finally {
          setLoading((prevState) => ({ ...prevState, googleLoading: false }));
        }
      };
      
      const handleGithubLogin = async () => {
        setLoading((prevState) => ({ ...prevState, githubLoading: true }));
        try {
          await signIn("github", { callbackUrl: `/dashboard` });
        } catch (error) {
          console.error("Error during GitHub login:", error);
          // Handle the error (e.g., show an error message)
        } finally {
          setLoading((prevState) => ({ ...prevState, githubLoading: false }));
        }
      };
      
    // console.log(form)
    // console.log(formErrors)
    return (
        <div className={styles.container}>
            <ToastContainer style={{ fontSize: "14px", marginTop:"5rem" }} />
            <div className={styles.login}>
                <div className={styles.loginCont}>
                    <div className={styles.logo}>
                        <div className={styles.logoImg}>
                            <div className={styles.contImg}>
                                <Image
                                    src="/assets/logo.png"
                                    alt="logo"
                                    width={100}
                                    height={50}
                                    className={styles.img}
                                />
                            </div>
                            <div className={styles.name}>
                                <h1>Roggers</h1>
                            </div>
                        </div>
                        <div className={styles.desc}>
                            <h1>Utterly fun Experience</h1>
                        </div>
                    </div>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <div className={styles.inputGroup}>
                                <input type="email" placeholder="someone@example.com" id="email" autoComplete="off"  value={form.email || ""} onChange={(e)=>{setField("email",e.target.value),validateField("email",e.target.value)}}/>
                                <SiMailchimp className={styles.icon} />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.inputGroup}>
                                <input type={passwordVisible ? 'text' : 'password'} id="password"  autoComplete="off"  value={form.password || ""} onChange={(e)=>{setField("password",e.target.value), validateField("password", e.target.value)}}/>
                                <FaFingerprint className={cls(styles.icon, styles.iconF)} onClick={()=>setPasswordVisible(!passwordVisible)} />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <div className={styles.button}>
                                <button type="submit">{loading.credentialsLoading ? <CircularBar   />: "Access"}</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.hrGroup}>
                    <span className={styles.hr1}></span>
                    <div className={styles.text}><p>or</p></div>
                    <span className={styles.hr2}></span>
                </div>

                <div className={styles.otherSignin}>
                    <div className={styles.google}>
                        <button type="button" onClick={handleGoogleLogin}><FcGoogle className={styles.icon} />Continue with Google  {loading.googleLoading ? <Meetup /> : ""} </button>
                    </div>
                    <div className={styles.github}>
                        <button type="button" onClick={handleGithubLogin}><FaGithub className={styles.icon} />Continue with Github  {loading.githubLoading ? <Meetup /> : ""}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login