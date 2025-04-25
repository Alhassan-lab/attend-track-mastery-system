
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "lecturer" | "admin" | "verification officer";
};

// Mock users database
const mockUsers = [
  {
    email: "lecturer@example.com",
    password: "password",
    userData: {
      id: "1",
      name: "John Doe",
      email: "lecturer@example.com",
      role: "lecturer"
    }
  },
  {
    email: "admin@example.com",
    password: "admin123",
    userData: {
      id: "2",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin"
    }
  },
  {
    email: "registry@example.com",
    password: "registry123",
    userData: {
      id: "3",
      name: "Registry Staff",
      email: "registry@example.com",
      role: "lecturer"
    }
  },
  {
    email: "abdallaahelhassani60@gmail.com",
    password: "Alhassan9095!!!",
    userData: {
      id: "4",
      name: "Verification Unit",
      email: "abdallaahelhassani60@gmail.com",
      role: "verification officer"
    }
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user in mock database
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser.userData);
        localStorage.setItem("user", JSON.stringify(foundUser.userData));
        toast.success("Logged in successfully");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
