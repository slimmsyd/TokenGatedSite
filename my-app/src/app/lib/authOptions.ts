
 



// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from 'next-auth/providers/google';
// import { db } from "./db";
// import bcrypt from "bcrypt";
// import { User as CustomUser } from "../../../../types";

// require('dotenv').config()





// export const authOptions: NextAuthOptions = {
//   debug: true, // Set debug to true to see more detailed error logs
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
//   },
//   pages: {
//     signIn: "/Login",
//   },
//   secret: process.env.NEXTAUTH_SECRET, // Ensure this environment variable is set in your production environment

//   providers: [

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),


//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "Enter Email..." },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials, req) => {
//         console.log("Authorize function called with credentials:", credentials);

//         try {
//           if (!credentials?.email || !credentials?.password) {
//             console.log("Missing credentials");
//             return null;
//           }

//           // Fetch user from your database
//           const existingUser = await db.user.findUnique({
//             where: { email: credentials?.email },
//           });

//           if (!existingUser) {
//             console.log("User not found");
//             return null;
//           }

//           const passwordMatch = await bcrypt.compare(
//             credentials.password,
//             existingUser.password || ""
//           );

//           if (!passwordMatch) {
//             console.log("Incorrect password");
//             return null;
//           }

//           // Ensure the returned user object matches the User type
//           return {
//             id: `${existingUser.id}`,
//             username: existingUser.username || '', // Ensure username is a string
//             email: existingUser.email,
//           } as CustomUser;

//         } catch (e: any) {
//           console.error("Error in authorization:", e);
//           return null;
//         }
//       }
//     }),

//   ],
//   callbacks: {
//     jwt: async ({ token, user, account, profile }) => {
//       // console.log("JWT callback called");
//       // console.log("Token:", token);
//       // console.log("User:", user);
//       // console.log("Account:", account);
//       // console.log("Profile:", profile);

//       if (account && account.provider === "google") {
//         let existingUser = await db.user.findUnique({
//           where: { email: profile?.email },
//         });

//         if (!existingUser) {
//           // console.log("Creating new user with Google profile:", profile);
//           const username = profile?.email?.split('@')[0]; // Using email prefix as username
//           existingUser = await db.user.create({
//             data: {
//               email: profile?.email as string,
//               username: username || null,
//               password: "googleAccountSIgnIN", // Or you can use null
//             },
//           });
//         }

//         token.uid = existingUser.id;
//         token.email = existingUser.email;
//         token.username = existingUser.username;
//       } else if (user) {
//         token.uid = user.id;
//         token.email = user.email;
//         token.username = user.username;
//         token.lifePathNumber = (user as CustomUser).lifePathNumber; // Use type assertion
//         token.zodiacSign = (user as CustomUser).zodiacSign; // Use type assertion
//       }

//       return token;
//     },
//     session: async ({ session, token }) => {
//       // console.log("Session callback called");
//       // console.log("Session data received:", session);

//       if (token.uid) {
//         session.user.id = token.uid;
//         session.user.email = token.email;
//         session.user.username = token.username;
//         session.user.lifePathNumber = token.lifePathNumber; // Correct property name
//         session.user.zodiacSign = token.zodiacSign; // Correct property name
//       }
//       return session;
//     },

 
//   },
// };
