
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AttendanceRecord, Course, Student, dataService } from "@/services/mockData";
import { format } from "date-fns";

const AttendanceScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get levels available for the selected course
  const getLevelsForCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.levels : [];
  };
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await dataService.getCourses();
        setCourses(coursesData);
        
        // If courseId in URL params, set it as selected
        const courseIdParam = searchParams.get("courseId");
        if (courseIdParam && coursesData.some(c => c.id === courseIdParam)) {
          setSelectedCourse(courseIdParam);
          
          // Set default level if available
          const course = coursesData.find(c => c.id === courseIdParam);
          if (course && course.levels.length > 0) {
            setSelectedLevel(course.levels[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [searchParams]);
  
  // Fetch students when course and level are selected
  useEffect(() => {
    if (selectedCourse && selectedLevel) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const studentsData = await dataService.getStudentsByCourseAndLevel(selectedCourse, selectedLevel);
          setStudents(studentsData);
          
          // Initialize all students as present
          const initialStatus: Record<string, boolean> = {};
          studentsData.forEach(student => {
            initialStatus[student.id] = true; // true = present, false = absent
          });
          setAttendanceStatus(initialStatus);
        } catch (error) {
          console.error("Error fetching students:", error);
          toast.error("Failed to load students");
        } finally {
          setLoading(false);
        }
      };
      
      fetchStudents();
    }
  }, [selectedCourse, selectedLevel]);
  
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedLevel(null);
    setStudents([]);
    setAttendanceStatus({});
    
    // Update URL params
    searchParams.set("courseId", courseId);
    setSearchParams(searchParams);
    
    // Set default level if only one level is available
    const levels = getLevelsForCourse(courseId);
    if (levels.length === 1) {
      setSelectedLevel(levels[0]);
    }
  };
  
  const handleLevelChange = (level: string) => {
    setSelectedLevel(Number(level));
    setStudents([]);
    setAttendanceStatus({});
  };
  
  const toggleStudentStatus = (studentId: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };
  
  const toggleAllStatus = (status: boolean) => {
    const newStatus: Record<string, boolean> = {};
    students.forEach(student => {
      newStatus[student.id] = status;
    });
    setAttendanceStatus(newStatus);
  };
  
  const handleSubmit = async () => {
    if (!selectedCourse || !selectedLevel || students.length === 0) {
      toast.error("Please select a course and level with students");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      const attendanceRecord: AttendanceRecord = {
        id: `a${Date.now()}`, // Generate a unique ID
        courseId: selectedCourse,
        level: selectedLevel,
        date: today,
        attendances: students.map(student => ({
          studentId: student.id,
          status: attendanceStatus[student.id] ? "present" : "absent"
        }))
      };
      
      await dataService.saveAttendanceRecord(attendanceRecord);
      toast.success("Attendance recorded successfully");
      
      // Reset form after submission
      setStudents([]);
      setAttendanceStatus({});
      setSelectedCourse("");
      setSelectedLevel(null);
      
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const presentCount = Object.values(attendanceStatus).filter(status => status).length;
  const absentCount = Object.values(attendanceStatus).filter(status => !status).length;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow p-4 md:p-6 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Take Attendance</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Select Course & Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select 
                  value={selectedCourse} 
                  onValueChange={handleCourseChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code}: {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCourse && (
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    value={selectedLevel?.toString() || ""} 
                    onValueChange={handleLevelChange}
                    disabled={loading || getLevelsForCourse(selectedCourse).length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      {getLevelsForCourse(selectedCourse).map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level} Level
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedCourse && selectedLevel && students.length > 0 && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle className="text-xl">
                    Student Attendance - {format(new Date(), "MMMM d, yyyy")}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      Present: <span className="font-bold text-attendance-present">{presentCount}</span>
                    </div>
                    <div className="text-sm">
                      Absent: <span className="font-bold text-attendance-absent">{absentCount}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleAllStatus(true)}
                    >
                      Mark All Present
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleAllStatus(false)}
                    >
                      Mark All Absent
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {students.map((student) => (
                    <div 
                      key={student.id} 
                      className="flex items-center justify-between p-3 rounded-md"
                      style={{
                        backgroundColor: attendanceStatus[student.id] 
                          ? 'rgba(76, 175, 80, 0.1)' 
                          : 'rgba(244, 67, 54, 0.1)'
                      }}
                    >
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.matricNumber}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`attendance-${student.id}`}>
                          {attendanceStatus[student.id] ? "Present" : "Absent"}
                        </Label>
                        <Switch
                          id={`attendance-${student.id}`}
                          checked={attendanceStatus[student.id] || false}
                          onCheckedChange={() => toggleStudentStatus(student.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-6 flex justify-end">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Attendance"}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {selectedCourse && selectedLevel && students.length === 0 && !loading && (
            <div className="text-center p-10 bg-gray-100 rounded-md">
              <p className="text-xl font-medium mb-2">No students found</p>
              <p className="text-muted-foreground">
                There are no students registered for this course at this level.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AttendanceScreen;
