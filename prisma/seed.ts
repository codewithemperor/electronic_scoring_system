import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create or get Academic Session
  let academicSession = await prisma.academicSession.findFirst({
    where: { name: '2024/2025' }
  })

  if (!academicSession) {
    academicSession = await prisma.academicSession.create({
      data: {
        name: '2024/2025',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-08-31'),
        isActive: true,
      },
    })
    console.log('Created academic session:', academicSession.name)
  } else {
    console.log('Found existing academic session:', academicSession.name)
  }

  // Create or get Departments
  const departmentData = [
    { name: 'Computer Science Technology', code: 'CST', description: 'Department of Computer Science Technology' },
    { name: 'Electrical Engineering', code: 'EEE', description: 'Department of Electrical Engineering' },
    { name: 'Accountancy', code: 'ACC', description: 'Department of Accountancy' },
    { name: 'Business Administration', code: 'BUS', description: 'Department of Business Administration' },
  ]

  const departments = []
  for (const deptData of departmentData) {
    let department = await prisma.department.findFirst({
      where: { code: deptData.code }
    })

    if (!department) {
      department = await prisma.department.create({
        data: deptData,
      })
      console.log('Created department:', department.name)
    } else {
      console.log('Found existing department:', department.name)
    }
    departments.push(department)
  }

  // Create or get Programs
  const programData = [
    { name: 'Computer Science Technology', code: 'CST', level: 'ND', departmentId: departments[0].id, cutOffMark: 40, maxCapacity: 50 },
    { name: 'Electrical Engineering Technology', code: 'EET', level: 'ND', departmentId: departments[1].id, cutOffMark: 40, maxCapacity: 40 },
    { name: 'Accountancy', code: 'ACC', level: 'ND', departmentId: departments[2].id, cutOffMark: 45, maxCapacity: 60 },
    { name: 'Business Administration', code: 'BUS', level: 'ND', departmentId: departments[3].id, cutOffMark: 40, maxCapacity: 55 },
  ]

  const programs = []
  for (const progData of programData) {
    let program = await prisma.program.findFirst({
      where: { code: progData.code }
    })

    if (!program) {
      program = await prisma.program.create({
        data: progData,
      })
      console.log('Created program:', program.name)
    } else {
      console.log('Found existing program:', program.name)
    }
    programs.push(program)
  }

  // Create or get Subjects
  const subjectData = [
    { name: 'Mathematics', code: 'MTH' },
    { name: 'English Language', code: 'ENG' },
    { name: 'Physics', code: 'PHY' },
    { name: 'Chemistry', code: 'CHE' },
    { name: 'Biology', code: 'BIO' },
    { name: 'Economics', code: 'ECO' },
    { name: 'Commerce', code: 'COM' },
    { name: 'Accounting', code: 'ACC' },
  ]

  const subjects = []
  for (const subData of subjectData) {
    let subject = await prisma.subject.findFirst({
      where: { code: subData.code }
    })

    if (!subject) {
      subject = await prisma.subject.create({
        data: subData,
      })
      console.log('Created subject:', subject.name)
    } else {
      console.log('Found existing subject:', subject.name)
    }
    subjects.push(subject)
  }

  // Create or get Screening
  let screening = await prisma.screening.findFirst({
    where: { name: 'ND Admission Screening 2024/2025' }
  })

  if (!screening) {
    // Get admin user or create one
    let adminUser = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    })

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@polytechnic.edu.ng',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          firstName: 'System',
          lastName: 'Administrator',
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      })
      console.log('Created admin user:', adminUser.email)
    }

    screening = await prisma.screening.create({
      data: {
        name: 'ND Admission Screening 2024/2025',
        academicSessionId: academicSession.id,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-12-31'),
        duration: 120,
        totalMarks: 100,
        passMarks: 40,
        status: 'ACTIVE',
        instructions: 'Please answer all questions carefully. You have 2 hours to complete the screening.',
        createdById: adminUser.id,
      },
    })
    console.log('Created screening:', screening.name)
  } else {
    console.log('Found existing screening:', screening.name)
  }

  // Create Sample Questions (only if they don't exist)
  const existingQuestionsCount = await prisma.question.count({
    where: { screeningId: screening.id }
  })

  if (existingQuestionsCount === 0) {
    const questionData = [
      {
        question: 'What is the capital of France?',
        subjectId: subjects[1].id, // English
        options: ['A) London', 'B) Berlin', 'C) Paris', 'D) Madrid'],
        correctAnswer: 'C',
        marks: 1,
        difficulty: 'EASY',
        screeningId: screening.id,
      },
      {
        question: 'What is 2 + 2?',
        subjectId: subjects[0].id, // Mathematics
        options: ['A) 3', 'B) 4', 'C) 5', 'D) 6'],
        correctAnswer: 'B',
        marks: 1,
        difficulty: 'EASY',
        screeningId: screening.id,
      },
      {
        question: 'What is the chemical symbol for water?',
        subjectId: subjects[3].id, // Chemistry
        options: ['A) H2O', 'B) CO2', 'C) O2', 'D) H2SO4'],
        correctAnswer: 'A',
        marks: 1,
        difficulty: 'EASY',
        screeningId: screening.id,
      },
      {
        question: 'What is the formula for the area of a circle?',
        subjectId: subjects[0].id, // Mathematics
        options: ['A) 2πr', 'B) πr²', 'C) 2πr²', 'D) πd'],
        correctAnswer: 'B',
        marks: 2,
        difficulty: 'MEDIUM',
        screeningId: screening.id,
      },
      {
        question: 'Which of the following is a renewable energy source?',
        subjectId: subjects[2].id, // Physics
        options: ['A) Coal', 'B) Natural Gas', 'C) Solar', 'D) Oil'],
        correctAnswer: 'C',
        marks: 2,
        difficulty: 'MEDIUM',
        screeningId: screening.id,
      },
    ]

    const questions = await Promise.all(
      questionData.map(q => prisma.question.create({ data: q }))
    )
    console.log('Created questions:', questions.length)
  } else {
    console.log('Found existing questions:', existingQuestionsCount)
  }

  // Create Sample Users (if they don't exist)
  const userData = [
    { email: 'admin@polytechnic.edu.ng', firstName: 'System', lastName: 'Administrator', role: 'SUPER_ADMIN' },
    { email: 'staff@polytechnic.edu.ng', firstName: 'Staff', lastName: 'User', role: 'STAFF' },
    { email: 'examiner@polytechnic.edu.ng', firstName: 'Examiner', lastName: 'User', role: 'EXAMINER' },
  ]

  for (const userDatum of userData) {
    let user = await prisma.user.findFirst({
      where: { email: userDatum.email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          ...userDatum,
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
          isActive: true,
        },
      })
      console.log('Created user:', user.email)
    } else {
      console.log('Found existing user:', user.email)
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })