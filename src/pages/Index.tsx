
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileSearch } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <FileSearch size={64} className="text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">TrackNMCN</h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete file tracking system for your organization. Track files from registry to CEO to departments with ease.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg">
                Login to System
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Real-time Tracking"
            description="Know exactly where your files are at all times with our real-time tracking system."
          />
          <FeatureCard
            title="Unique Identifiers"
            description="Each file gets a unique barcode or number for easy identification and tracking."
          />
          <FeatureCard
            title="Comprehensive Reporting"
            description="Generate detailed reports about file movements and statuses."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
