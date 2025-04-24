
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Course, dataService } from "@/services/mockData";
import { Calendar, ListCheck, FileChartColumn } from "lucide-react";

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await dataService.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow p-4 md:p-6 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <ListCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/attendance">
                  <Button className="w-full" size="sm">Take Attendance</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Reports</CardTitle>
                <FileChartColumn className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/reports">
                  <Button className="w-full" size="sm" variant="outline">View Reports</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          
          {loading ? (
            <div className="p-8 text-center">Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle>{course.code}: {course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Available for: {course.levels.map(level => `${level} Level`).join(", ")}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/attendance?courseId=${course.id}`} className="flex-1">
                        <Button variant="default" size="sm" className="w-full">
                          Take Attendance
                        </Button>
                      </Link>
                      <Link to={`/reports?courseId=${course.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Reports
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
