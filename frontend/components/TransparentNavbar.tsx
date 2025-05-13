"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

interface TransparentNavbarProps {
  onRegisterClick: () => void;
}

export default function TransparentNavbar({ onRegisterClick }: TransparentNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);

      // Check which section is in view
      const sections = document.querySelectorAll('section[id], footer[id]');
      let currentSection = '';

      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.id;
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className={`w-full transition-colors duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}>
        <div className="container mx-auto flex items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.svg"
              alt="ChiyaChain Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <Image
              src="/assets/logoname.svg"
              alt="ChiyaChain Name"
              width={120}
              height={30}
              className="object-contain"
            />
          </Link>
          <div className={`flex-1 flex items-center justify-center gap-6 ${scrolled ? "text-gray-800" : "text-white"}`}>
            <button 
              onClick={() => scrollToSection('home')} 
              className={`${activeSection === 'home' ? 'text-green-500 font-semibold' : ''} ${scrolled ? "hover:text-green-600" : "hover:text-green-400"}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`${activeSection === 'about' ? 'text-green-500 font-semibold' : ''} ${scrolled ? "hover:text-green-600" : "hover:text-green-400"}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`${activeSection === 'features' ? 'text-green-500 font-semibold' : ''} ${scrolled ? "hover:text-green-600" : "hover:text-green-400"}`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`${activeSection === 'contact' ? 'text-green-500 font-semibold' : ''} ${scrolled ? "hover:text-green-600" : "hover:text-green-400"}`}
            >
              Contact
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={onRegisterClick}
              variant="primary"
              className={`transition-[background,color,transform] duration-300 border-2 ${scrolled 
                ? 'bg-transparent !text-green-600 border-green-600 hover:!text-green-700 hover:bg-transparent hover:scale-[1.02]' 
                : 'bg-transparent border-white text-white hover:bg-white hover:text-gray-900'}`}
            >
              Register User
            </Button>
            <Button 
              variant="primary" 
              className={`transition-[background,color,border,transform] duration-300 ${scrolled ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105' : 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900'}`}
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
