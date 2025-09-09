import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data (optional - comment out if you want to preserve data)
  console.log('🗑️  Clearing existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.session.deleteMany()
  await prisma.screeningRecord.deleteMany()
  await prisma.examResult.deleteMany()
  await prisma.question.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.application.deleteMany()
  await prisma.candidate.deleteMany()
  await prisma.staff.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.superAdmin.deleteMany()
  await prisma.screeningCriteria.deleteMany()
  await prisma.program.deleteMany()
  await prisma.department.deleteMany()
  await prisma.user.deleteMany()

  // Create Departments
  console.log('📚 Creating departments...')
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Computing & Information Technology',
        code: 'CIT',
        description: 'Department of Computing and Information Technology',
        faculty: 'Engineering & Technology'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Engineering Technology',
        code: 'ET',
        description: 'Department of Engineering Technology',
        faculty: 'Engineering & Technology'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Management Sciences',
        code: 'MS',
        description: 'Department of Management Sciences',
        faculty: 'Business & Social Sciences'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Communication & Media Studies',
        code: 'CMS',
        description: 'Department of Communication and Media Studies',
        faculty: 'Arts & Humanities'
      }
    })
  ])

  // Create Programs
  console.log('🎓 Creating programs...')
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        name: 'Computer Science',
        code: 'CS',
        departmentId: departments[0].id,
        duration: 4,
        capacity: 120,
        description: 'Bachelor of Technology in Computer Science'
      }
    }),
    prisma.program.create({
      data: {
        name: 'Electrical Engineering',
        code: 'EE',
        departmentId: departments[1].id,
        duration: 4,
        capacity: 80,
        description: 'Bachelor of Engineering in Electrical Engineering'
      }
    }),
    prisma.program.create({
      data: {
        name: 'Business Administration',
        code: 'BA',
        departmentId: departments[2].id,
        duration: 4,
        capacity: 150,
        description: 'Bachelor of Science in Business Administration'
      }
    }),
    prisma.program.create({
      data: {
        name: 'Mass Communication',
        code: 'MC',
        departmentId: departments[3].id,
        duration: 4,
        capacity: 100,
        description: 'Bachelor of Science in Mass Communication'
      }
    })
  ])

  // Create Screening Criteria
  console.log('📝 Creating screening criteria...')
  await Promise.all([
    prisma.screeningCriteria.create({
      data: {
        name: 'UTME Score',
        description: 'Unified Tertiary Matriculation Examination score',
        departmentId: departments[0].id,
        weight: 40,
        minValue: 180,
        maxValue: 400
      }
    }),
    prisma.screeningCriteria.create({
      data: {
        name: 'O\'Level Results',
        description: 'O\'Level examination results',
        departmentId: departments[0].id,
        weight: 30,
        minValue: 0,
        maxValue: 30
      }
    }),
    prisma.screeningCriteria.create({
      data: {
        name: 'Post-UTME Score',
        description: 'Post-UTME examination score',
        departmentId: departments[0].id,
        weight: 20,
        minValue: 0,
        maxValue: 20
      }
    }),
    prisma.screeningCriteria.create({
      data: {
        name: 'Interview Performance',
        description: 'Oral interview assessment',
        departmentId: departments[0].id,
        weight: 10,
        minValue: 0,
        maxValue: 10
      }
    })
  ])

  // Hash passwords for users
  const hashedPassword = await hashPassword('password123')

  // Create Super Admin
  console.log('👑 Creating super admin...')
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'superadmin@aope.edu.ng',
      username: 'superadmin',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+234 800 000 0001',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true
    }
  })

  await prisma.superAdmin.create({
    data: {
      userId: superAdminUser.id
    }
  })

  // Create Admin
  console.log('📋 Creating admin...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aope.edu.ng',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Department',
      lastName: 'Administrator',
      phone: '+234 800 000 0002',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true
    }
  })

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      departmentId: departments[0].id
    }
  })

  // Create Staff
  console.log('👨‍🏫 Creating staff...')
  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@aope.edu.ng',
      username: 'staff',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+234 800 000 0003',
      role: 'STAFF',
      status: 'ACTIVE',
      emailVerified: true
    }
  })

  await prisma.staff.create({
    data: {
      userId: staffUser.id,
      departmentId: departments[0].id,
      employeeId: 'EMP001'
    }
  })

  // Create Candidates
  // Create Candidates
  console.log('🎓 Creating candidates...')
  const candidateUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'sarah.johnson@email.com',
        username: 'sarah.johnson',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+234 801 234 5678',
        role: 'CANDIDATE',
        status: 'ACTIVE',
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'michael.chen@email.com',
        username: 'michael.chen',
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Chen',
        phone: '+234 802 345 6789',
        role: 'CANDIDATE',
        status: 'ACTIVE',
        emailVerified: true
      }
    }),
    prisma.user.create({
      data: {
        email: 'emma.williams@email.com',
        username: 'emma.williams',
        password: hashedPassword,
        firstName: 'Emma',
        lastName: 'Williams',
        phone: '+234 803 456 7890',
        role: 'CANDIDATE',
        status: 'ACTIVE',
        emailVerified: true
      }
    })
  ])

  const candidateProfiles = await Promise.all([
    prisma.candidate.create({
      data: {
        userId: candidateUsers[0].id,
        jambNumber: 'JAMB2025001',
        utmeScore: 265,
        birthDate: new Date('2000-05-15'),
        gender: 'Female',
        stateOfOrigin: 'Lagos',
        lga: 'Ikeja',
        address: '123, Adeola Odeku Street, Victoria Island, Lagos',
        screeningStatus: 'IN_PROGRESS'
      }
    }),
    prisma.candidate.create({
      data: {
        userId: candidateUsers[1].id,
        jambNumber: 'JAMB2025002',
        utmeScore: 245,
        birthDate: new Date('2001-03-20'),
        gender: 'Male',
        stateOfOrigin: 'Abia',
        lga: 'Umuahia',
        address: '45, Bank Road, Umuahia, Abia State',
        screeningStatus: 'PENDING_REVIEW'
      }
    }),
    prisma.candidate.create({
      data: {
        userId: candidateUsers[2].id,
        jambNumber: 'JAMB2025003',
        utmeScore: 280,
        birthDate: new Date('1999-12-10'),
        gender: 'Female',
        stateOfOrigin: 'Rivers',
        lga: 'Port Harcourt',
        address: '67, Aba Road, Port Harcourt, Rivers State',
        screeningStatus: 'COMPLETED'
      }
    })
  ])


  // Create Applications
  await Promise.all([
    prisma.application.create({
      data: {
        candidateId: candidateProfiles[0].id, // ✅ Correct
        programId: programs[0].id,
        status: 'UNDER_REVIEW',
        totalScore: 78
      }
    }),
    prisma.application.create({
      data: {
        candidateId: candidateProfiles[1].id,
        programId: programs[1].id,
        status: 'PENDING'
      }
    }),
    prisma.application.create({
      data: {
        candidateId: candidateProfiles[2].id,
        programId: programs[2].id,
        status: 'APPROVED',
        totalScore: 85
      }
    })
  ])


  // Create Screening Records
  console.log('📊 Creating screening records...')
  const criteria = await prisma.screeningCriteria.findMany()
  
  await Promise.all([
    prisma.screeningRecord.create({
      data: {
        candidateId: candidateProfiles[0].id,
        criteriaId: criteria[0].id,
        score: 98,
        scoredBy: 'EMP001'
      }
    }),
    prisma.screeningRecord.create({
      data: {
        candidateId: candidateProfiles[0].id,
        criteriaId: criteria[1].id,
        score: 28,
        scoredBy: 'EMP001'
      }
    }),
    prisma.screeningRecord.create({
      data: {
        candidateId: candidateProfiles[2].id,
        criteriaId: criteria[0].id,
        score: 112,
        scoredBy: 'EMP001'
      }
    }),
    prisma.screeningRecord.create({
      data: {
        candidateId: candidateProfiles[2].id,
        criteriaId: criteria[1].id,
        score: 30,
        scoredBy: 'EMP001'
      }
    })
  ])

  // Create Sample Exams
  console.log('📝 Creating sample exams...')
  const exam = await prisma.exam.create({
    data: {
      title: 'Computer Science Post-UTME',
      description: 'Post-UTME examination for Computer Science program',
      departmentId: departments[0].id,
      duration: 60,
      totalMarks: 50,
      passingMarks: 25,
      scheduledAt: new Date('2025-02-01T09:00:00')
    }
  })

  // Create Questions for the exam
  await Promise.all([
    prisma.question.create({
      data: {
        examId: exam.id,
        question: 'What is the time complexity of binary search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        marks: 5
      }
    }),
    prisma.question.create({
      data: {
        examId: exam.id,
        question: 'Which data structure follows LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 1,
        marks: 5
      }
    }),
    prisma.question.create({
      data: {
        examId: exam.id,
        question: 'What is the primary key in a database?',
        options: ['A unique identifier', 'A foreign key', 'An index', 'A constraint'],
        correctAnswer: 0,
        marks: 5
      }
    })
  ])

  // Create System Config
  console.log('⚙️ Creating system configuration...')
  await Promise.all([
    prisma.systemConfig.create({
      data: {
        key: 'academic_year',
        value: '2025/2025',
        description: 'Current academic year'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'admission_deadline',
        value: '2025-02-15',
        description: 'Admission application deadline'
      }
    }),
prisma.systemConfig.create({
      data: {
        key: 'exam_schedule',
        value: '2025-02-01T09:00:00',
        description: 'Scheduled date and time for Post-UTME exams'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'minimum_utme_score',
        value: '180',
        description: 'Minimum UTME score required for admission'
      }
    }),
    prisma.systemConfig.create({
      data: {
        key: 'contact_email',
        value: 'admissions@aope.edu.ng',
        description: 'Official admissions office email address'
      }
    })
  ])

  console.log('✅ Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

