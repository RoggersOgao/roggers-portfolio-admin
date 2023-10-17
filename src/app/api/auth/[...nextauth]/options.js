import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import axios from "axios";

const axiosInstance = axios.create({
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Treat 404 as a valid status
  },
});

const getUserByEmail = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data.user || response.data.users;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error(error.response.data.details);
    }
    throw new Error(error.message);
  }
};

const updateUser = async (updateUrl, userData) => {
  try {
    await axios.put(updateUrl, userData);
  } catch (error) {
    console.error(error.response.data.details || error);
    throw new Error(error.message);
  }
};
const createUser = async (createUrl, userData) => {
  try {
    await axios.post(createUrl, userData);
  } catch (error) {
    console.error(error.response.data.details || error);
    throw error;
  }
};

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (credentials.email == "undefined") {
            throw new Error("Email is required! 🥵");
          } else if (credentials.password == "undefined") {
            throw new Error("password is required! 🥵");
          } else {
            // checking if the email exists
            const emailCheckResponse = await fetch(
              `${process.env.API_URL}/api/auth/signup?email=${credentials.email}`,
              {
                method: "GET",
              }
            );
            if (!emailCheckResponse.ok) {
              throw new Error("No user by that username exists 🥵");
            } else {
              const user = await emailCheckResponse.json();

              // compare the password with the hashed password

              const passwordMatch = await compare(
                credentials.password,
                user.users.password
              );

              // if passwords match
              if (passwordMatch) {
                return user.users;
              } else {
                throw new Error("The password is incorrect! 🤯🤯");
              }
            }
          }
        } catch (err) {
          throw new Error(err.message);
        }
      },
    }),
    // google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // github provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  session: {
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
    strategy: "jwt",
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex");
    },
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session }) {
      try {
        if (session?.user?.email) {
          const user = await axios.get(
            `${process.env.API_URL}/api/users?email=${session?.user?.email}`
          );
          const { _id, name, email, image, socials, personalInfo, role } =
            user.data.users;
          session.user = {
            _id,
            name,
            email,
            image,
            socials,
            personalInfo,
            role,
          };
          return session;
        } else {
          return session;
        }
      } catch (err) {
        throw new Error(err.message);
      }
    },

    async signIn({ profile, account, user }) {
      switch (account.provider) {
        case "github":
          try {
            const gbuser = await axiosInstance.get(
              `${process.env.API_URL}/api/auth/githuboauthusers?email=${profile.email}`
            );

            const updateUserData = {
              name: profile.name,
              email: profile.email,
              image: profile.avatar_url,
              socials: [
                {
                  twitter:
                    profile.twitter_username === "null"
                      ? ""
                      : `https://twitter.com/${profile.twitter_username}`,
                },
              ],
              personalInfo: [
                {
                  location: profile.location,
                  company: profile.company,
                  bio: profile.bio || "", // Use the || operator to set an empty string if bio is falsy
                },
              ],
              role: "user",
            };

            if (gbuser.data.user) {
              console.log("user found")
              const pduser = await getUserByEmail(
                `${process.env.API_URL}/api/users?email=${profile.email}`
              );
              const updatedUsergb = {
                ...pduser,
                ...updateUserData,
                _id: undefined,
                createdAt: undefined,
                updatedAt: undefined,
                __v: undefined,
                password: undefined,
                socials: [
                  ...pduser.socials,
                  ...updateUserData.socials.filter((item) =>
                    !pduser.socials.some((existingItem) =>
                      item.twitter === existingItem.twitter
                    )
                  ),
                ],
                personalInfo: [
                  ...pduser.personalInfo,
                  ...updateUserData.personalInfo.filter((item) =>
                    !pduser.personalInfo.some((existingItem) =>
                      item.location === existingItem.location &&
                      item.company === existingItem.company &&
                      item.bio === existingItem.bio
                    )
                  ),
                ],
              };
            
              // Now, you can use the updatedUsergb object for your further operations, such as making a PUT request.
            
              console.log(updatedUsergb); // To see the merged object
              
              await axiosInstance.put(
                `${process.env.API_URL}/api/users?email=${profile.email}`,
                updatedUsergb
              );
              console.log("updated successfully")
            } else {
              console.log("user not found")
              // User does not exist, create a new user
              const userData = {
                email: profile.email,
                name: profile.name,
                image: profile.avatar_url,
                type: profile.type,
                site_admin: profile.site_admin,
                company: profile.company,
                blog: profile.blog,
                location: profile.location,
                hireable: profile.hireable,
                bio: profile.bio || "", // Use the || operator to set an empty string if bio is falsy
                twitter_username: profile.twitter_username,
                public_repos: profile.public_repos,
                public_gists: profile.public_gists,
                total_private_repos: profile.total_private_repos,
                followers: profile.followers,
                following: profile.following,
                role: "user",
              };

              await axiosInstance.post(
                `${process.env.API_URL}/api/auth/githuboauthusers`,
                userData
              );

              const newUser = {
                name: profile.name,
                email: profile.email,
                image: profile.avatar_url,
                socials: [
                  {
                    twitter:
                      profile.twitter_username === "null"
                        ? ""
                        : `https://twitter.com/${profile.twitter_username}`,
                  },
                ],
                personalInfo: [
                  {
                    location: profile.location,
                    company: profile.company,
                    bio: profile.bio || "", // Use the || operator to set an empty string if bio is falsy
                  },
                ],
                role: "user",
              };

              await axiosInstance.post(
                `${process.env.API_URL}/api/users`,
                newUser
              );
            }

            return true;
          } catch (error) {
            console.log({ Error: error });
            throw new Error(error);
          }

        case "google":
          try {
            const gguser = await axiosInstance.get(
              `${process.env.API_URL}/api/auth/googleoauthusers?email=${profile.email}`
            );

            const userData = {
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              role: "user",
            };

            if (
              Array.isArray(gguser.data.users) &&
              gguser.data.users.length > 0
            ) {
              const pduser = await getUserByEmail(
                `${process.env.API_URL}/api/users?email=${profile.email}`
              );

              const updatedUsergg = {
                ...pduser,
                ...userData,
              };
              // User exists, update their information
              const updatedUser = await axiosInstance.put(
                `${process.env.API_URL}/api/users?email=${profile.email}`,
                updatedUsergg // Use updatedUsergg directly
              );
              console.log("User updated:", updatedUser.data);
            } else {
              // User does not exist, create a new user


              await createUser(
                `${process.env.API_URL}/api/users`,
                userData
              );
              await axiosInstance.post(
                `${process.env.API_URL}/api/auth/googleoauthusers`,
                {
                  ...userData,
                  locale: profile.locale,
                }
              );
              console.log("New user created");
            }

            return true;
          } catch (error) {
            // Handle errors here
            console.error("Error:", error);

            // Customize the error response as needed
            return { error: "Internal Server Error", status: 500 };
          }

        // If user doesn't exist, create a new user

        case "credentials":
          try {
            const pduser = await getUserByEmail(
              `${process.env.API_URL}/api/users?email=${user.email}`
            );
            // console.log(pduser)
            if (pduser) {
              const updatedUserData = {
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
              };

              const updatedUseCr = {
                ...pduser,
                ...updatedUserData,
                _id: undefined,
                createdAt: undefined,
                updatedAt: undefined,
                __v: undefined,
                password: undefined,
              };

              await axiosInstance.put(
                `${process.env.API_URL}/api/users?email=${user.email}`,
                updatedUseCr
              );
            }
            return true;
          } catch (err) {
            throw new Error(err.message);
          }
      }
    },
  },
};
