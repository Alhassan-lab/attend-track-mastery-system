
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, FileText, Users, Building2, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");
  
  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <FileText size={18} /> },
    { path: "/files", label: "Files", icon: <FileText size={18} /> },
  ];
  
  const adminLinks = [
    { path: "/admin/departments", label: "Departments", icon: <Building2 size={18} /> },
    { path: "/admin/hods", label: "HODs", icon: <UserCircle size={18} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={18} /> },
  ];
  
  return (
    <header className="bg-primary text-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">TrackNMCN</Link>
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
              className={`flex items-center gap-1 px-3 py-2 rounded hover:bg-primary/90 ${
                isActive(link.path) ? "font-bold bg-primary/90" : ""
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          
          {user && user.role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:bg-primary/90">
                  Admin
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Controls</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {adminLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="flex items-center gap-2 w-full">
                      {link.icon}
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
                className={`flex items-center gap-2 px-4 py-3 ${isActive(link.path) ? "font-bold bg-primary/90" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            
            {user && user.role === "admin" && (
              <>
                <div className="px-4 py-2 text-sm font-semibold">Admin Controls</div>
                {adminLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-3 ${isActive(link.path) ? "font-bold bg-primary/90" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </>
            )}
            
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
