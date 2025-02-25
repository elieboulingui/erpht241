"use client"; // This tells Next.js that this is a client-side component

import React from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, status } = useSession(); // Fetch session data

  if (status === "loading") {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center text-red-500">You are not logged in</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
        {/* Profile Header */}
        <div className="flex justify-center mb-8">
          <img
            src={session.user.image || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500"
          />
        </div>

        {/* Name and Bio */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">{session.user.name}</h1>
          <p className="text-gray-600 mt-2">{session.user.bio || "No bio provided"}</p>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-800">Contact Info</h2>
          <ul className="list-none mt-4 text-gray-600">
            <li className="py-2">
              <strong>Email:</strong> {session.user.email}
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-medium text-gray-800">Social Media</h2>
          <ul className="list-none mt-4 text-gray-600">
            <li className="py-2">
              <a
                href={session.user.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                LinkedIn
              </a>
            </li>
            <li className="py-2">
              <a
                href={session.user.github || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
