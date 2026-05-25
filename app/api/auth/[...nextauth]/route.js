import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../../lib/mongodb";
import Otp from "../../../../models/Otp";
import User from "../../../../models/User";

export const authOptions = {
  providers: [
    // 1. Google Single-Click Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
    }),

    // 2. Custom Email OTP Login
    CredentialsProvider({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      // authorize block ke andar:
      async authorize(credentials) {
        await connectDB();

        const { email, otp } = credentials;

        // 1. Check karo kya OTP sahi hai
        const otpRecord = await Otp.findOne({ email: email, code: otp });

        if (!otpRecord) {
          throw new Error("Invalid OTP! Please check your code.");
        }

        // 2. STRICT LOGIN CHECK: Dekho kya user database mein pehle se registered hai
        const user = await User.findOne({ email: email });

        if (!user) {
          // 🚨 Agar user nahi mila, toh login block kar do!
          throw new Error("Account not found. Please register first.");
        }

        // 3. Agar user registered hai, toh OTP delete karo aur session create karo
        await Otp.deleteOne({ _id: otpRecord._id });

        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Hum apna custom login page banayenge
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
