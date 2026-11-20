import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const clientUrl =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_CLIENT_URL ??
  "http://localhost:3000";

const mongoUri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/rentworx";

const mongoClient = new MongoClient(mongoUri);
const db = mongoClient.db();

export const auth = betterAuth({
  appName: "RentWorx",
  baseURL: clientUrl,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "rentworx-local-development-secret-change-me",
  trustedOrigins: [clientUrl],

  database: mongodbAdapter(db, { client: mongoClient }),

  advanced: {
    database: {
      joins: true,
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "google-client-id-placeholder",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ?? "google-client-secret-placeholder",
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "customer",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          role: user.role,
        }),
        expirationTime: "1h",
        issuer: clientUrl,
        audience: clientUrl,
      },
    }),
    nextCookies(),
  ],
});
