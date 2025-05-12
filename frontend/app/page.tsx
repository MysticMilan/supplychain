"use client";

import { useState } from "react";
import RegisterUserForm from "./admin/components/RegisterUserForm";
import TransparentNavbar from "@/components/TransparentNavbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="min-h-screen">
      <TransparentNavbar onRegisterClick={togglePopup} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src="/assets/background/img1.jpg"
          alt="Tea Garden"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-6">
            Welcome to ChiyaChain
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-12">
            Empowering transparency in the tea supply chain — from garden to your cup 🍵
          </p>
          <div className="flex gap-6 justify-center">
            <Link href="#features">
              <Button 
                variant="secondary" 
                className="bg-white hover:bg-gray-100 text-gray-900 transition-colors px-8 py-3 text-lg"
              >
                Learn More
              </Button>
            </Link>
            <Link href="/verify">
              <Button 
                variant="primary" 
                className="bg-green-600 hover:bg-green-700 text-white transition-colors px-8 py-3 text-lg"
              >
                Track Tea
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose ChiyaChain?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="mb-4">
                <Image src="/assets/background/img2.jpg" alt="Transparency" width={64} height={64} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Transparency</h3>
              <p className="text-gray-600">Track your tea&apos;s journey from garden to cup with blockchain technology</p>
            </div>
            <div className="text-center p-6">
              <div className="mb-4">
                <Image src="/assets/background/img3.jpg" alt="Quality" width={64} height={64} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600">Verify authenticity and quality at every step of the supply chain</p>
            </div>
            <div className="text-center p-6">
              <div className="mb-4">
                <Image src="/assets/background/img3.jpg" alt="Sustainability" width={64} height={64} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Practices</h3>
              <p className="text-gray-600">Support environmentally conscious tea production and distribution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Image src="/assets/logowhite.svg" alt="ChiyaChain Logo" width={120} height={32} className="mx-auto" />
          </div>
          <div className="mb-8"></div>
          <p className="text-gray-100">&copy; CodeKiro 2025. All rights reserved.</p>
        </div>
      </footer>

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
    </div>
  );
}
