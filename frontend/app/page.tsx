"use client";

import { useState } from "react";
import RegisterUserForm from "./admin/components/RegisterUserForm"; // Import the register user form
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to ChiyaChain
        </h1>
        <p className="text-lg max-w-xl mb-8">
          Empowering transparency in the tea supply chain — from garden to your cup 🍵
        </p>
        <Link
          href="/verify"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Track Your Tea
        </Link>

        <button
          onClick={togglePopup}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Register User
        </button>

        {/* Popup for Register User Form */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background */}
            <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>

            {/* Popup Card */}
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto text-center border border-green-200">
              <button
                onClick={togglePopup}
                className="absolute top-4 right-4"
              >
                ✖
              </button>
              <RegisterUserForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
