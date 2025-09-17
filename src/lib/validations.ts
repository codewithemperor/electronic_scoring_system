import { z } from "zod"

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Register validation schema
export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
           "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  role: z.enum(["ADMIN", "STAFF", "EXAMINER"]).optional(),
})

// Candidate registration schema
export const candidateRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
           "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  dateOfBirth: z.date(),
  gender: z.enum(["MALE", "FEMALE"]),
  stateOfOrigin: z.string().min(2, "State of origin is required"),
  lga: z.string().min(2, "LGA is required"),
  
  // Academic Information
  schoolName: z.string().min(2, "School name is required"),
  graduationYear: z.number().min(1900).max(new Date().getFullYear() + 1),
  olevelResults: z.array(z.object({
    subject: z.string().min(2, "Subject is required"),
    grade: z.enum(["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"]),
    examType: z.enum(["WAEC", "NECO", "NABTEB"]),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
  })).min(5, "At least 5 O'Level results are required"),
  
  // Program Selection
  programId: z.string().min(1, "Program selection is required"),
  screeningId: z.string().min(1, "Screening selection is required"),
})

// Screening creation schema
export const screeningSchema = z.object({
  name: z.string().min(2, "Screening name is required"),
  academicSessionId: z.string().min(1, "Academic session is required"),
  startDate: z.date(),
  endDate: z.date(),
  duration: z.number().min(30, "Duration must be at least 30 minutes"),
  totalMarks: z.number().min(50, "Total marks must be at least 50"),
  passMarks: z.number().min(20, "Pass marks must be at least 20"),
  instructions: z.string().optional(),
})

// Question creation schema
export const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  subjectId: z.string().min(1, "Subject is required"),
  options: z.array(z.string()).length(4, "Exactly 4 options are required"),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  marks: z.number().min(1, "Marks must be at least 1"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  screeningId: z.string().optional(),
})

// Department creation schema
export const departmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  code: z.string().min(2, "Department code is required"),
  description: z.string().optional(),
})

// Program creation schema
export const programSchema = z.object({
  name: z.string().min(2, "Program name is required"),
  code: z.string().min(2, "Program code is required"),
  level: z.enum(["ND", "HND"]),
  departmentId: z.string().min(1, "Department is required"),
  cutOffMark: z.number().min(20, "Cut-off mark must be at least 20"),
  maxCapacity: z.number().min(10, "Maximum capacity must be at least 10"),
})

// Subject creation schema
export const subjectSchema = z.object({
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(2, "Subject code is required"),
})

// Academic session creation schema
export const academicSessionSchema = z.object({
  name: z.string().min(2, "Session name is required"),
  startDate: z.date(),
  endDate: z.date(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CandidateRegistrationInput = z.infer<typeof candidateRegistrationSchema>
export type ScreeningInput = z.infer<typeof screeningSchema>
export type QuestionInput = z.infer<typeof questionSchema>
export type DepartmentInput = z.infer<typeof departmentSchema>
export type ProgramInput = z.infer<typeof programSchema>
export type SubjectInput = z.infer<typeof subjectSchema>
export type AcademicSessionInput = z.infer<typeof academicSessionSchema>