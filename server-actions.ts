// pages/api/auth/signin.ts
import { NextApiRequest, NextApiResponse } from "next";
import { signIn } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Sign in with Google
    const result = await signIn("google", { redirect: false });
    res.status(200).json(result);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
