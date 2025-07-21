import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/enhanced-button';
import { Search } from 'lucide-react';

export function Header() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CinemaDiscover
            </span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/watch-later" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Watch Later
            </Link>
          </nav>
        </div>

        {/* Search and Auth */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => navigate('/')}
          >
            <Search className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="default" size="sm">
                    Sign up
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  },
                }}
                afterSignOutUrl="/"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 