//this is the NextAuth.js config file
//necessary to set up authentication in my next.js app using nextauth
//where I define authentication providers, db connecetion, any other options or callbacks

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../../models/User';

// hashes passwords
import bcrypt from 'bcryptjs';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        console.log('Credentials:', credentials);

        if (!credentials.username) {
          return Promise.resolve(null);
        }
        const user = await User.findOne({ username: credentials.username });
        // console.log('User found:', user); // Add this line

        if (user) {
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // console.log('Password validation:', isValid); // Add this line

          if (isValid) {
            const userObject = user.toObject();
            console.log('Returning user object:', {
              id: userObject._id.toString(),
              username: userObject.username,
            });
            return Promise.resolve({
              id: userObject._id.toString(),
              username: userObject.username,
            });
          } else {
            console.log('else1');
            return Promise.resolve(null);
          }
        } else {
          console.log('else2');
          return Promise.resolve(null);
        }
      },
    }),
  ],
  database: process.env.MONGO_URI,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Ensure this is true in production
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async signIn(user) {
      console.log('Inside signIn callback');
      console.log('User:', user);
      // If you want to allow the sign-in to proceed, return true.
      // If you want to deny the sign-in, return false.
      return true;
    },
    async jwt({ token, user }) {
      console.log('JWT callback received:', token, user);
      //jwt populates user object
      if (user) {
        console.log('if user', user);
        token.sub = user.id;
        token.username = user.username;
        console.log('token after defining:', token);
        // return {
        //   ...token,
        //   id: user.id,
        //   username: user.username, //username references User model
        // };
      }
      // } else {
      //   console.error('User is undefined:', user);
      // }
      return token;
    },
    async session({ session, token }) {
      console.log('Inside session callback');
      console.log('Session before:', session);
      console.log('Token:', token);
      //check if token is defined before running
      if (session && token) {
        console.log('Inside session callback');
        console.log('Session:', session);
        console.log('Token:', token);

        if (token) {
          console.log('if token:', token);
          session.user = {
            ...session.user,
            id: token.sub,
            username: token.username,
          };
          console.log('if token, then create:', session.user);
        }
      } else {
        console.error('Session or token is undefined:', session, token);
      }
      console.log('Session after:', session);
      return session;
    },
  },
});
