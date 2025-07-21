import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer id="contact" className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CinemaDiscover
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover your next favorite movie with CinemaDiscover. Search through thousands of movies,
              create your watchlist, and stay updated with the latest releases.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/watch-later" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Watch Later
                </Link>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org/documentation/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Shagun Vishnoi</p>
              <a
                href="mailto:shagun.vishnoi2024@nst.rishihood.edu.in"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                shagun.vishnoi2024@nst.rishihood.edu.in
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* TMDB Attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
                alt="TMDB Logo"
                className="h-8"
              />
              <span className="text-sm text-muted-foreground">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </span>
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CinemaDiscover. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 