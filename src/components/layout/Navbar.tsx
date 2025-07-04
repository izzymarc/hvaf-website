
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Humanity Verse Aid Foundation Logo" 
            className="h-10 w-auto"
          />
          <span className={`font-bold text-sm md:text-md leading-4 ${scrolled ? 'text-primary-700' : 'text-primary-400'}`}>
            Humanity Verse <br /> Aid Foundation
          </span>
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-4">
            <Button asChild className="bg-accent hover:bg-accent-600">
              <Link to="/donate">Donate</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="flex md:hidden">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-6 mt-12">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      className={({ isActive }) =>
                        `text-lg font-medium transition-colors ${isActive ? 'text-primary underline font-bold' : 'hover:text-primary'}`
                      }
                      end={link.path === '/'}
                    >
                      {link.name}
                    </NavLink>
                  ))}
                  <Link 
                    to="/admin" 
                    className="text-muted-foreground hover:text-primary text-sm mt-4"
                  >
                    Admin Login
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all ${isActive ? 'text-primary after:w-full font-bold' : 'hover:text-primary'}`
                  }
                  end={link.path === '/'}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
            <Button asChild className="bg-accent hover:bg-accent-600 shadow-lg hover:shadow-xl transition-all duration-300 px-6">
              <Link to="/donate">Donate</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
