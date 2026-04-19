import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Menu, X } from 'lucide-react';

export function PublicLayout() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-glow-emerald group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">Trackify</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary relative ${
                    location.pathname === link.path 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/login"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center rounded-full btn-primary-glow px-5 py-2.5 text-sm transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <motion.div 
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border/50"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                  location.pathname === link.path ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border/50 flex flex-col gap-3">
              <Link 
                to="/login"
                className="block w-full text-center px-4 py-3 border border-border/50 rounded-xl text-foreground font-medium hover:bg-muted/50 transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/login"
                className="block w-full text-center px-4 py-3 btn-primary-glow rounded-xl font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">Trackify</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
                The premium financial OS that brings order to your spending. Deep insights, beautiful design, and AI-powered budgeting.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <div className="space-y-2.5">
                <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
                <Link to="/contact" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <div className="space-y-2.5">
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} All copyrights are reserved by PixoraLabz.tech.</p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">GitHub</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
