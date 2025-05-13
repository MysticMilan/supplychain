"use client";

import { useState } from "react";
import RegisterUserForm from "./admin/components/RegisterUserForm";
import TransparentNavbar from "@/components/TransparentNavbar";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Linkedin, Instagram, BadgeCheck, Leaf, ShieldCheck, BarChart2 } from "lucide-react";

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="min-h-screen">
      <TransparentNavbar onRegisterClick={togglePopup} />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col justify-between">
        <div className="absolute inset-0">
          <Image
            src="/assets/background/img1.jpg"
            alt="Tea Garden"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-green-900/60 to-green-800/80" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-5 drop-shadow-lg animate-fade-in-up">ChiyaChain</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 opacity-90 animate-fade-in-up delay-100">
            Next-generation transparency for the tea supply chain — from garden to your cup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white hover:bg-green-100 text-green-900 font-semibold transition-colors px-8 py-3 text-lg rounded-md shadow"
            >
              About Us
            </button>
            <Link href="/verify">
              <Button 
                variant="primary" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors px-8 py-3 text-lg shadow"
              >
                Track Your Tea
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-green-800">About ChiyaChain</h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            ChiyaChain is a blockchain-powered platform dedicated to bringing radical transparency, trust, and efficiency to the tea supply chain. Our mission is to empower growers, manufacturers, distributors, and consumers with real-time data, ensuring every cup of tea is authentic, traceable, and ethically sourced.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="bg-green-100/80 rounded-2xl p-10 w-full md:w-[40%] shadow-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:scale-105 flex flex-col items-center text-center">
              <h3 className="text-2xl md:text-3xl font-semibold text-green-800 mb-4">Our Vision</h3>
              <p className="text-gray-700 text-base md:text-lg mb-2">A world where every tea leaf&apos;s journey is transparent, fair, and sustainable. We envision a future where consumers, farmers, and businesses are connected through trust, technology, and shared values. By leveraging blockchain, we aim to eradicate fraud, empower ethical sourcing, and create a transparent supply chain that benefits everyone from the grower to the tea lover.</p>
            </div>
            <div className="bg-green-100/80 rounded-2xl p-10 w-full md:w-[40%] shadow-xl border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:scale-105 flex flex-col items-center text-center">
              <h3 className="text-2xl md:text-3xl font-semibold text-green-800 mb-4">Our Mission</h3>
              <p className="text-gray-700 text-base md:text-lg mb-2">To digitize and democratize the tea supply chain for the benefit of all stakeholders, ensuring authenticity, quality, and ethical practices at every stage. We strive to provide real-time, verifiable data to empower growers, manufacturers, distributors, and consumers, fostering a culture of transparency and excellence in the tea industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-14 text-green-800">Features</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="feature-card flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="mb-4 bg-green-100 p-4 rounded-full flex items-center justify-center">
                <BadgeCheck className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-green-800">End-to-End Traceability</h3>
              <p className="text-gray-600">Track your tea from the garden to your cup with immutable blockchain records.</p>
            </div>
            <div className="feature-card flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="mb-4 bg-green-100 p-4 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-green-800">Quality & Authenticity</h3>
              <p className="text-gray-600">Every product is verified and tamper-proof, ensuring only authentic tea reaches you.</p>
            </div>
            <div className="feature-card flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="mb-4 bg-green-100 p-4 rounded-full flex items-center justify-center">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-green-800">Sustainability</h3>
              <p className="text-gray-600">Promoting ethical sourcing and eco-friendly practices across the supply chain.</p>
            </div>
            <div className="feature-card flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 border-2 border-green-100 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center">
              <div className="mb-4 bg-green-100 p-4 rounded-full flex items-center justify-center">
                <BarChart2 className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 text-green-800">Real-Time Analytics</h3>
              <p className="text-gray-600">Gain insights and monitor performance with live analytics dashboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-green-950 text-white pt-12 pb-6 mt-8 rounded-t-3xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-12">
            {/* Logo & Socials */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <Image src="/assets/logowhite.svg" alt="ChiyaChain Logo" width={60} height={18} className="mb-2" />
              <p className="text-green-100/80 text-base max-w-xs text-center mb-2">
                Empowering transparency, trust, and sustainability in every cup of tea.
              </p>
              <div className="flex gap-4 mt-2 justify-center">
                <a href="https://x.com/MysticMilan369" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition" title="X (formerly Twitter)">
                  <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none">
                    <path d="M87.6 28.5H103.2L69.6 67.3L109.2 119.2H82.7L58.7 88.6L31.5 119.2H15.8L51.3 77.1L13.2 28.5H40.2L61.3 56.9L87.6 28.5ZM83.1 111.2H91.3L39.7 36.1H31.1L83.1 111.2Z" fill="white"/>
                  </svg>
                </a>
                <a href="https://instagram.com/MysticMilan369" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition" title="Instagram">
                  <Instagram className="w-7 h-7" />
                </a>
                <a href="https://linkedin.com/in/MysticMilan369" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition" title="LinkedIn">
                  <Linkedin className="w-7 h-7" />
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="flex flex-col gap-1 text-green-100/90">
                <li><a href="#home" className="hover:text-green-400 transition">Home</a></li>
                <li><a href="#about" className="hover:text-green-400 transition">About</a></li>
                <li><a href="#features" className="hover:text-green-400 transition">Features</a></li>
                <li><a href="#contact" className="hover:text-green-400 transition">Contact</a></li>
              </ul>
            </div>
            {/* Contact Info */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
              <p className="text-green-100/90 mb-1"><span className="font-medium">Email:</span> <a href="mailto:support@chiyachain.com" className="hover:underline">support@chiyachain.com</a></p>
              <p className="text-green-100/90 mb-1"><span className="font-medium">Phone:</span> +977 (980) 123-4567</p>
              <p className="text-green-100/90"><span className="font-medium">Address:</span> CodeKiro LLC, Kathmandu, Nepal</p>
            </div>
          </div>
          <div className="border-t border-green-700/30 mt-10 pt-4 text-center">
            <span className="text-green-200/90 text-sm">&copy; CodeKiro 2025. All rights reserved.</span>
          </div>
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
