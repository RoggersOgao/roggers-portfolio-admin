import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import axios from "axios";

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
  callbacks: {
    async session({ session }) {
      try {
        if (session?.user?.email) {
          const user = await axios.get(
            `${process.env.API_URL}/api/users?email=${session?.user?.email}`
          );
          const {
            _id,
            name,
            email,
            password,
            image,
            socials,
            personalInfo,
            role,
          } = user.data.users;
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
            const gbuser = await axios.get(
              `${process.env.API_URL}/api/auth/githuboauthusers?email=${profile.email}`
            );

            const pduser = gbuser.data.user;
            // Check if the user exists based on the response data
            if (pduser) {
              const updateUserData = {
                ...pduser,
                name: profile.name,
                email: profile.email,
                image: profile.avatar_url,
                socials: [
                  {
                    ...gbuser.socials[0].toObject(),
                    twitter:
                      profile.twitter_username == "null"
                        ? ""
                        : `https://twitter.com/${profile.twitter_username}`,
                  },
                ],
                personalInfo: [
                  {
                    ...gbuser.personalInfo[0].toObject(),
                    location: profile.location,
                    company: profile.company,
                    bio: profile.bio == "null" ? "" : profile.bio,
                  },
                ],
                role: "user",
              };
              const updateOperation = { $set: updateUserData };

              const updUser = await axios.put(
                `${process.env.API_URL}/api/users?email=${profile.email}`,
                updateOperation
              );
            }
            return true;
          } catch (error) {
            if (error.response.status === 404) {
              try {
                const res = await axios.post(
                  `${process.env.API_URL}/api/auth/githuboauthusers`,
                  {
                    email: profile.email,
                    name: profile.name,
                    image: profile.avatar_url,
                    type: profile.type,
                    site_admin: profile.site_admin,
                    company: profile.company,
                    blog: profile.blog,
                    location: profile.location,
                    hireable: profile.hireable,
                    bio: profile.bio,
                    twitter_username: profile.twitter_username,
                    public_repos: profile.public_repos,
                    public_gists: profile.public_gists,
                    total_private_repos: profile.total_private_repos,
                    followers: profile.followers,
                    following: profile.following,
                    role: "user",
                  }
                );
                const newUser = {
                  name: profile.name,
                  email: profile.email,
                  image: profile.avatar_url,
                  socials: [
                    {
                      twitter:
                        profile.twitter_username == "null"
                          ? ""
                          : `https://twitter.com/${profile.twitter_username}`,
                    },
                  ],
                  personalInfo: [
                    {
                      location: profile.location,
                      company: profile.company,
                      bio: profile.bio || "",
                    },
                  ],
                  role: "user",
                };
                try {
                  const response = await axios.post(
                    `${process.env.API_URL}/api/users`,
                    newUser
                  );
                  
                } catch (err) {
                  throw new Error(err.response.data.details);
                }
              } catch (err) {
                // throw new Error(err.message);
              }
              // Handle the case when the user is not found in your API
            } else {
              return NextResponse.json(error, { status: 500 });
            }
            return true;
          }
        case "google":
          try {
            const gguser = await axios.get(
              `${process.env.API_URL}/api/auth/googleoauthusers?email=${profile.email}`
            );
            const pduser = gguser.data.users;
            // Check if the user exists based on the response data
            if (pduser) {
              const updateUserData = {
                ...pduser,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                role: "user",
              };
              const updateOperation = { $set: updateUserData };

              const updUser = await axios.put(
                `${process.env.API_URL}/api/users?email=${profile.email}`,
                updateOperation
              );
            }
            return true;
          } catch (error) {
            // Handle the "not found" error here
            if (error.response.status === 404) {
              try {
                const res = await axios.post(
                  `${process.env.API_URL}/api/auth/googleoauthusers`,
                  {
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    locale: profile.locale,
                    role: "user",
                  }
                );
                
                const newUser = {
                  name: profile.name,
                  email: profile.email,
                  image: profile.picture,
                  role: "user",
                };
                const response = await axios.post(
                  `${process.env.API_URL}/api/users`,
                  newUser
                );
              } catch (err) {
                // throw new Error(err.message);
              }
              // Handle the case when the user is not found in your API
            } else {
              return NextResponse.json(error, { status: 500 });
            }
            return true;
          }

        // If user doesn't exist, create a new user

        case "credentials":
          try {
            const cruser = await axios.get(
              `${process.env.API_URL}/api/users?email=${user.email}`
            );
            const pduser = await cruser.data.users;
            if (pduser) {
              const updatedUserData = {
                ...pduser,
                name: user.name,
                email: user.email,
                image: user.image,
                socials: user.socials,
                personalInfo: user.personalInfo,
                role: user.role,
              };

              // creating a $set update operation to update only te speicifeid field

              const updateOperation = { $set: updatedUserData };
              try {
                const response = await axios.put(
                  `${process.env.API_URL}/api/users?email=${user.email}`,
                  updateOperation
                );
                return true;
              } catch (err) {
                // console.log(err.response.data.details);
              }
            }
          } catch (err) {
            throw new Error(err.message);
          }
          return true;
      }
    },
  },
};
