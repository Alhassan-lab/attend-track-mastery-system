
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AttendTrack</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              The comprehensive attendance management system for educational institutions.
              Track student attendance, generate reports, and ensure compliance with attendance requirements.
            </p>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </section>
        
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Easy Attendance Tracking</h3>
              <p>Quickly mark students present or absent with our intuitive interface.</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Comprehensive Reports</h3>
              <p>Generate daily, weekly, monthly, semester, or session-based attendance reports.</p>
            </div>
            
            <div className="p-6 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Attendance Compliance</h3>
              <p>Monitor student attendance against the 75% threshold requirement.</p>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to streamline your attendance management?</h2>
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              <Button size="lg">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} AttendTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
