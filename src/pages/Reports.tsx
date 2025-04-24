
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { AttendanceRecord, Course, Student, dataService } from "@/services/mockData";
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell, ResponsiveContainer } from "recharts";

type StudentAttendanceStats = {
  studentId: string;
  name: string;
  matricNumber: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
};

type ReportPeriod = "daily" | "weekly" | "monthly" | "semester" | "session";

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>("weekly");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<StudentAttendanceStats[]>([]);
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
  
  // Fetch students and attendance data when course and level are selected
  useEffect(() => {
    if (selectedCourse && selectedLevel) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch students for this course and level
          const studentsData = await dataService.getStudentsByCourseAndLevel(selectedCourse, selectedLevel);
          setStudents(studentsData);
          
          // Fetch attendance records for this course and level
          const records = await dataService.getAttendanceRecordsByCourse(selectedCourse, selectedLevel);
          setAttendanceRecords(records);
          
          // Calculate attendance stats based on the selected period
          calculateAttendanceStats(studentsData, records, reportPeriod);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to load attendance data");
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [selectedCourse, selectedLevel, reportPeriod]);
  
  const calculateAttendanceStats = (
    studentsList: Student[], 
    records: AttendanceRecord[], 
    period: ReportPeriod
  ) => {
    // Filter records by the selected time period
    const filteredRecords = filterRecordsByPeriod(records, period);
    
    // Calculate stats for each student
    const stats = studentsList.map(student => {
      let totalClasses = 0;
      let presentCount = 0;
      let absentCount = 0;
      
      filteredRecords.forEach(record => {
        const studentAttendance = record.attendances.find(a => a.studentId === student.id);
        if (studentAttendance) {
          totalClasses++;
          if (studentAttendance.status === "present") {
            presentCount++;
          } else {
            absentCount++;
          }
        }
      });
      
      const attendancePercentage = totalClasses > 0
        ? Math.round((presentCount / totalClasses) * 100)
        : 0;
      
      return {
        studentId: student.id,
        name: student.name,
        matricNumber: student.matricNumber,
        totalClasses,
        presentCount,
        absentCount,
        attendancePercentage
      };
    });
    
    setAttendanceStats(stats);
  };
  
  const filterRecordsByPeriod = (records: AttendanceRecord[], period: ReportPeriod): AttendanceRecord[] => {
    const now = new Date();
    
    switch (period) {
      case "daily":
        return records.filter(record => {
          const recordDate = parseISO(record.date);
          return format(recordDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
        });
        
      case "weekly":
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        return records.filter(record => {
          const recordDate = parseISO(record.date);
          return isWithinInterval(recordDate, { start: weekStart, end: weekEnd });
        });
        
      case "monthly":
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        return records.filter(record => {
          const recordDate = parseISO(record.date);
          return isWithinInterval(recordDate, { start: monthStart, end: monthEnd });
        });
        
      case "semester":
        // Simplified semester calculation (last 4 months)
        const semesterStart = subDays(now, 120);
        return records.filter(record => {
          const recordDate = parseISO(record.date);
          return recordDate >= semesterStart && recordDate <= now;
        });
        
      case "session":
        // Simplified session calculation (last 9 months)
        const sessionStart = subDays(now, 270);
        return records.filter(record => {
          const recordDate = parseISO(record.date);
          return recordDate >= sessionStart && recordDate <= now;
        });
        
      default:
        return records;
    }
  };
  
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setSelectedLevel(null);
    setStudents([]);
    setAttendanceRecords([]);
    setAttendanceStats([]);
    
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
    setAttendanceRecords([]);
    setAttendanceStats([]);
  };
  
  const handlePeriodChange = (period: ReportPeriod) => {
    setReportPeriod(period);
  };
  
  const getCourseTitle = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? `${course.code}: ${course.title}` : "";
  };
  
  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-attendance-success";
    if (percentage >= 60) return "text-attendance-warning";
    return "text-attendance-absent";
  };
  
  const chartData = attendanceStats.map(stat => ({
    name: stat.name.split(" ")[0], // Just use first name for chart display
    attendancePercentage: stat.attendancePercentage
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow p-4 md:p-6 bg-gray-50">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Attendance Reports</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                
                <div className="space-y-2">
                  <Label>Report Period</Label>
                  <Select 
                    value={reportPeriod} 
                    onValueChange={(value) => handlePeriodChange(value as ReportPeriod)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="semester">Semester</SelectItem>
                      <SelectItem value="session">Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedCourse && selectedLevel && attendanceStats.length > 0 && (
            <Tabs defaultValue="table">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {getCourseTitle(selectedCourse)} - {selectedLevel} Level
                </h2>
                <TabsList>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                  <TabsTrigger value="chart">Chart View</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="table" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="text-left p-3 font-medium">Student</th>
                            <th className="text-left p-3 font-medium">Matric Number</th>
                            <th className="text-center p-3 font-medium">Classes</th>
                            <th className="text-center p-3 font-medium">Present</th>
                            <th className="text-center p-3 font-medium">Absent</th>
                            <th className="text-center p-3 font-medium">Attendance %</th>
                            <th className="text-left p-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceStats.map((stat) => (
                            <tr key={stat.studentId} className="border-t">
                              <td className="p-3">{stat.name}</td>
                              <td className="p-3">{stat.matricNumber}</td>
                              <td className="p-3 text-center">{stat.totalClasses}</td>
                              <td className="p-3 text-center text-attendance-present">{stat.presentCount}</td>
                              <td className="p-3 text-center text-attendance-absent">{stat.absentCount}</td>
                              <td className="p-3 text-center font-semibold">{stat.attendancePercentage}%</td>
                              <td className={`p-3 ${getStatusColor(stat.attendancePercentage)} font-semibold`}>
                                {stat.attendancePercentage >= 75 
                                  ? "Satisfactory" 
                                  : "Below Requirement"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chart" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Percentage</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, "Attendance"]} />
                        <Legend />
                        <Bar dataKey="attendancePercentage" name="Attendance %">
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.attendancePercentage >= 75 ? '#4CAF50' : '#F44336'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {selectedCourse && selectedLevel && attendanceStats.length === 0 && !loading && (
            <div className="text-center p-10 bg-gray-100 rounded-md">
              <p className="text-xl font-medium mb-2">No attendance data found</p>
              <p className="text-gray-500 mb-4">
                There are no attendance records for this course and level in the selected period.
              </p>
              <Button variant="outline" onClick={() => setReportPeriod("session")}>
                View All Records
              </Button>
            </div>
          )}
          
          {(!selectedCourse || !selectedLevel) && !loading && (
            <div className="text-center p-10 bg-gray-100 rounded-md">
              <p className="text-xl font-medium mb-2">Select a course and level</p>
              <p className="text-gray-500">
                Please select a course and level to view attendance reports.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Reports;
