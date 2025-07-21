import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/enhanced-button';

export function Header() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-[#1C1C2B] border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-white">CinemaDiscover</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm text-white hover:text-white/80 transition-colors">
            Home
          </Link>
          <Link to="/watch-later" className="text-sm text-white hover:text-white/80 transition-colors">
            Watch Later
          </Link>
          <a
            href="#contact"
            onClick={handleContactClick}
            className="text-sm text-white hover:text-white/80 transition-colors cursor-pointer"
          >
            Contact Us
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  className="bg-[#F15757] text-white hover:bg-[#F15757]/90"
                >
                  Signup
                </Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                }
              }}
              afterSignOutUrl="/"
            />
          )}
        </div>
      </div>
    </header>
  );
} 