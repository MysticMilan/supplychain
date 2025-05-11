"use client";

import { useState } from "react";
import RegisterUserForm from "./admin/components/RegisterUserForm";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
        <div className="space-y-4"> {/* Removed w-full/max-w-sm to prevent conflict */}
          <Link href="/verify" className="block w-48 mx-auto">
            <Button variant="primary" className="w-full">
              Track Your Tea
            </Button>
          </Link>

          <Button
            onClick={togglePopup}
            variant="primary"
            className="w-48"
          >
            Register User
          </Button>
        </div>


        {/* Popup for Register User Form */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl">
              <div className="relative p-8">
                <Button
                  onClick={togglePopup}
                  variant="secondary"
                  className="absolute top-4 right-4 p-2 min-w-0 w-auto h-auto"
                >
                  ✖
                </Button>
                <RegisterUserForm />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
