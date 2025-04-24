
// Types
export interface Course {
  id: string;
  code: string;
  title: string;
  levels: number[];
}

export interface Student {
  id: string;
  name: string;
  matricNumber: string;
  level: number;
  courses: string[]; // Course IDs
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  level: number;
  date: string;
  attendances: {
    studentId: string;
    status: "present" | "absent";
  }[];
}

// Mock Data
export const mockCourses: Course[] = [
  {
    id: "c1",
    code: "CSC101",
    title: "Introduction to Computer Science",
    levels: [100]
  },
  {
    id: "c2",
    code: "CSC201",
    title: "Programming Fundamentals",
    levels: [200]
  },
  {
    id: "c3",
    code: "CSC301",
    title: "Data Structures & Algorithms",
    levels: [300]
  },
  {
    id: "c4",
    code: "CSC401",
    title: "Software Engineering",
    levels: [400]
  },
  {
    id: "c5",
    code: "GES100",
    title: "Communication Skills",
    levels: [100, 200, 300, 400]
  }
];

export const mockStudents: Student[] = [
  // 100 Level Students
  { id: "s1", name: "Alice Johnson", matricNumber: "MAT/21/0001", level: 100, courses: ["c1", "c5"] },
  { id: "s2", name: "Bob Smith", matricNumber: "MAT/21/0002", level: 100, courses: ["c1", "c5"] },
  { id: "s3", name: "Charlie Brown", matricNumber: "MAT/21/0003", level: 100, courses: ["c1", "c5"] },
  { id: "s4", name: "David Williams", matricNumber: "MAT/21/0004", level: 100, courses: ["c1", "c5"] },
  { id: "s5", name: "Emma Davis", matricNumber: "MAT/21/0005", level: 100, courses: ["c1", "c5"] },
  
  // 200 Level Students
  { id: "s6", name: "Frank Wilson", matricNumber: "MAT/20/0001", level: 200, courses: ["c2", "c5"] },
  { id: "s7", name: "Grace Thompson", matricNumber: "MAT/20/0002", level: 200, courses: ["c2", "c5"] },
  { id: "s8", name: "Harry Anderson", matricNumber: "MAT/20/0003", level: 200, courses: ["c2", "c5"] },
  { id: "s9", name: "Ivy Martin", matricNumber: "MAT/20/0004", level: 200, courses: ["c2", "c5"] },
  { id: "s10", name: "Jack Robinson", matricNumber: "MAT/20/0005", level: 200, courses: ["c2", "c5"] },
  
  // 300 Level Students
  { id: "s11", name: "Kate White", matricNumber: "MAT/19/0001", level: 300, courses: ["c3", "c5"] },
  { id: "s12", name: "Leo Garcia", matricNumber: "MAT/19/0002", level: 300, courses: ["c3", "c5"] },
  { id: "s13", name: "Mia Lee", matricNumber: "MAT/19/0003", level: 300, courses: ["c3", "c5"] },
  { id: "s14", name: "Noah Clark", matricNumber: "MAT/19/0004", level: 300, courses: ["c3", "c5"] },
  { id: "s15", name: "Olivia Lewis", matricNumber: "MAT/19/0005", level: 300, courses: ["c3", "c5"] },
  
  // 400 Level Students
  { id: "s16", name: "Peter Hall", matricNumber: "MAT/18/0001", level: 400, courses: ["c4", "c5"] },
  { id: "s17", name: "Quinn Young", matricNumber: "MAT/18/0002", level: 400, courses: ["c4", "c5"] },
  { id: "s18", name: "Ryan King", matricNumber: "MAT/18/0003", level: 400, courses: ["c4", "c5"] },
  { id: "s19", name: "Sara Scott", matricNumber: "MAT/18/0004", level: 400, courses: ["c4", "c5"] },
  { id: "s20", name: "Tom Adams", matricNumber: "MAT/18/0005", level: 400, courses: ["c4", "c5"] }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  // Some example records, in a real app these would be generated
  {
    id: "a1",
    courseId: "c1",
    level: 100,
    date: "2025-04-20",
    attendances: [
      { studentId: "s1", status: "present" },
      { studentId: "s2", status: "present" },
      { studentId: "s3", status: "absent" },
      { studentId: "s4", status: "present" },
      { studentId: "s5", status: "present" }
    ]
  },
  {
    id: "a2",
    courseId: "c1",
    level: 100,
    date: "2025-04-21",
    attendances: [
      { studentId: "s1", status: "present" },
      { studentId: "s2", status: "absent" },
      { studentId: "s3", status: "present" },
      { studentId: "s4", status: "present" },
      { studentId: "s5", status: "absent" }
    ]
  }
];

// Local storage keys
const STORAGE_KEYS = {
  COURSES: "attendance_courses",
  STUDENTS: "attendance_students",
  ATTENDANCE_RECORDS: "attendance_records"
};

// Helper functions to initialize and retrieve data
const initializeData = () => {
  // Check if data exists in local storage, if not, initialize with mock data
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mockCourses));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(mockStudents));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(mockAttendanceRecords));
  }
};

// Initialize data on import
initializeData();

// Service functions
export const dataService = {
  getCourses: (): Promise<Course[]> => {
    return new Promise((resolve) => {
      const courses = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || "[]");
      setTimeout(() => resolve(courses), 300); // Simulate API delay
    });
  },
  
  getStudents: (): Promise<Student[]> => {
    return new Promise((resolve) => {
      const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || "[]");
      setTimeout(() => resolve(students), 300);
    });
  },
  
  getStudentsByCourseAndLevel: (courseId: string, level: number): Promise<Student[]> => {
    return new Promise((resolve) => {
      const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || "[]");
      const filtered = students.filter(
        (student: Student) => 
          student.level === level && 
          student.courses.includes(courseId)
      );
      setTimeout(() => resolve(filtered), 300);
    });
  },
  
  getAttendanceRecords: (): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => {
      const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS) || "[]");
      setTimeout(() => resolve(records), 300);
    });
  },
  
  getAttendanceRecordsByCourse: (courseId: string, level: number): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => {
      const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS) || "[]");
      const filtered = records.filter(
        (record: AttendanceRecord) => 
          record.courseId === courseId && 
          record.level === level
      );
      setTimeout(() => resolve(filtered), 300);
    });
  },
  
  saveAttendanceRecord: (record: AttendanceRecord): Promise<AttendanceRecord> => {
    return new Promise((resolve) => {
      const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS) || "[]");
      
      // Check if we're updating an existing record
      const existingIndex = records.findIndex((r: AttendanceRecord) => r.id === record.id);
      
      if (existingIndex >= 0) {
        // Update existing record
        records[existingIndex] = record;
      } else {
        // Add new record
        records.push(record);
      }
      
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(records));
      setTimeout(() => resolve(record), 300);
    });
  }
};
