import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a super admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@polytechnic.edu.ng' },
    update: {},
    create: {
      email: 'admin@polytechnic.edu.ng',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'SUPER_ADMIN',
    },
  })

  // Create academic session
  const academicSession = await prisma.academicSession.create({
    data: {
      name: '2024/2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-07-31'),
      isActive: true,
    },
  })

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: 'CST' },
      update: {},
      create: {
        name: 'Computer Science Technology',
        code: 'CST',
        description: 'Department of Computer Science Technology',
      },
    }),
    prisma.department.upsert({
      where: { code: 'EEE' },
      update: {},
      create: {
        name: 'Electrical and Electronics Engineering',
        code: 'EEE',
        description: 'Department of Electrical and Electronics Engineering',
      },
    }),
    prisma.department.upsert({
      where: { code: 'BST' },
      update: {},
      create: {
        name: 'Business Studies',
        code: 'BST',
        description: 'Department of Business Studies',
      },
    }),
  ])

  // Create programs
  const programs = await Promise.all([
    prisma.program.upsert({
      where: { code: 'CST-ND' },
      update: {},
      create: {
        name: 'Computer Science Technology (ND)',
        code: 'CST-ND',
        level: 'ND',
        departmentId: departments[0].id,
        cutOffMark: 40,
        maxCapacity: 50,
      },
    }),
    prisma.program.upsert({
      where: { code: 'CST-HND' },
      update: {},
      create: {
        name: 'Computer Science Technology (HND)',
        code: 'CST-HND',
        level: 'HND',
        departmentId: departments[0].id,
        cutOffMark: 45,
        maxCapacity: 40,
      },
    }),
    prisma.program.upsert({
      where: { code: 'EEE-ND' },
      update: {},
      create: {
        name: 'Electrical and Electronics Engineering (ND)',
        code: 'EEE-ND',
        level: 'ND',
        departmentId: departments[1].id,
        cutOffMark: 42,
        maxCapacity: 45,
      },
    }),
  ])

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { code: 'MTH' },
      update: {},
      create: {
        name: 'Mathematics',
        code: 'MTH',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'ENG' },
      update: {},
      create: {
        name: 'English Language',
        code: 'ENG',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'PHY' },
      update: {},
      create: {
        name: 'Physics',
        code: 'PHY',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'CHEM' },
      update: {},
      create: {
        name: 'Chemistry',
        code: 'CHEM',
      },
    }),
    prisma.subject.upsert({
      where: { code: 'BIO' },
      update: {},
      create: {
        name: 'Biology',
        code: 'BIO',
      },
    }),
  ])

  // Create sample questions
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        subjectId: subjects[0].id, // Mathematics
        question: 'What is the value of x in the equation 2x + 5 = 15?',
        options: ['A) 5', 'B) 10', 'C) 15', 'D) 20'],
        correctAnswer: 'A',
        marks: 1,
        difficulty: 'EASY',
      },
    }),
    prisma.question.create({
      data: {
        subjectId: subjects[1].id, // English
        question: 'Which of the following is a synonym for "beautiful"?',
        options: ['A) Ugly', 'B) Attractive', 'C) Plain', 'D) Simple'],
        correctAnswer: 'B',
        marks: 1,
        difficulty: 'EASY',
      },
    }),
    prisma.question.create({
      data: {
        subjectId: subjects[2].id, // Physics
        question: 'What is the SI unit of force?',
        options: ['A) Joule', 'B) Watt', 'C) Newton', 'D) Pascal'],
        correctAnswer: 'C',
        marks: 1,
        difficulty: 'MEDIUM',
      },
    }),
  ])

  // Create a sample screening
  const screening = await prisma.screening.create({
    data: {
      name: 'ND Admission Screening 2024/2025',
      academicSessionId: academicSession.id,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-30'),
      duration: 120, // 2 hours
      totalMarks: 100,
      passMarks: 40,
      status: 'ACTIVE',
      instructions: 'Read all questions carefully before answering. You have 2 hours to complete the test.',
      createdById: superAdmin.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log('Super Admin credentials:')
  console.log('Email: admin@polytechnic.edu.ng')
  console.log('Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })