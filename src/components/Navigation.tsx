
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/attendance", label: "Take Attendance" },
    { path: "/reports", label: "Reports" },
  ];
  
  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">AttendTrack</Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-primary/90"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user && navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded hover:bg-primary/90 ${
                isActive(link.path) ? "font-bold bg-primary/90" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* User menu */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {user.name}</span>
              <Button 
                variant="secondary"
                onClick={() => logout()}
                className="bg-white text-primary hover:bg-gray-100"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/95 py-2">
          <div className="container mx-auto px-4 flex flex-col">
            {user && navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`px-4 py-3 ${isActive(link.path) ? "font-bold bg-primary/90" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Button 
                variant="link" 
                className="text-white justify-start px-4 py-3"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <Link 
                to="/login"
                className="px-4 py-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
