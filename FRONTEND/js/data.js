/**
 * AI-Event-Manager Frontend Data Layer & State Store
 * Synchronized with UI/ datasets (96 users, 15 staff, 80 students, 8 venues, 12 resources, 12 rules, verify_data schemas).
 */

const DEFAULT_USERS = [
  {
    "user_id": "ADM001",
    "registration_id": "ADM001",
    "name": "Dr. Aris Thorne",
    "email": "aris.thorne@college.edu",
    "password": "AdminPass#2026",
    "role": "admin",
    "department": "Administration",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z"
  },
  {
    "user_id": "STF001",
    "registration_id": "STF001",
    "name": "Prof. Rajesh Raman",
    "email": "rajesh.raman@college.edu",
    "password": "StaffPass#001",
    "role": "staff",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Professor & Head",
    "specialization": "Artificial Intelligence & Distributed Systems",
    "phone": "+91-9840112201",
    "office_room": "CSE-301",
    "assigned_club": "ACM Student Chapter"
  },
  {
    "user_id": "STF002",
    "registration_id": "STF002",
    "name": "Dr. Meenakshi Sundaram",
    "email": "meenakshi.s@college.edu",
    "password": "StaffPass#002",
    "role": "staff",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Professor & Head",
    "specialization": "VLSI & Signal Processing",
    "phone": "+91-9840112202",
    "office_room": "ECE-201",
    "assigned_club": "IEEE Student Branch"
  },
  {
    "user_id": "STF003",
    "registration_id": "STF003",
    "name": "Dr. Vikramaditya Sen",
    "email": "vikram.sen@college.edu",
    "password": "StaffPass#003",
    "role": "staff",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Professor & Head",
    "specialization": "Robotics & Thermal Systems",
    "phone": "+91-9840112203",
    "office_room": "MECH-101",
    "assigned_club": "SAE Collegiate Club"
  },
  {
    "user_id": "STF004",
    "registration_id": "STF004",
    "name": "Dr. Ananya Deshmukh",
    "email": "ananya.deshmukh@college.edu",
    "password": "StaffPass#004",
    "role": "staff",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Associate Professor",
    "specialization": "Deep Learning & NLP",
    "phone": "+91-9840112204",
    "office_room": "AI-105",
    "assigned_club": "AI Innovators Club"
  },
  {
    "user_id": "STF005",
    "registration_id": "STF005",
    "name": "Prof. K. R. Balaji",
    "email": "kr.balaji@college.edu",
    "password": "StaffPass#005",
    "role": "staff",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Associate Professor",
    "specialization": "Renewable Energy & Smart Grids",
    "phone": "+91-9840112205",
    "office_room": "EEE-204",
    "assigned_club": "Green Energy Forum"
  },
  {
    "user_id": "STF006",
    "registration_id": "STF006",
    "name": "Dr. Sunita Kulkarni",
    "email": "sunita.kulkarni@college.edu",
    "password": "StaffPass#006",
    "role": "staff",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Associate Professor",
    "specialization": "Cloud Computing & Cybersecurity",
    "phone": "+91-9840112206",
    "office_room": "IT-208",
    "assigned_club": "Cyber Security Cell"
  },
  {
    "user_id": "STF007",
    "registration_id": "STF007",
    "name": "Prof. David V. Thomas",
    "email": "david.thomas@college.edu",
    "password": "StaffPass#007",
    "role": "staff",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Assistant Professor",
    "specialization": "Structural Analysis & Geo-Tech",
    "phone": "+91-9840112207",
    "office_room": "CIV-102",
    "assigned_club": "Eco-Builders Club"
  },
  {
    "user_id": "STF008",
    "registration_id": "STF008",
    "name": "Dr. Priya Nambiar",
    "email": "priya.nambiar@college.edu",
    "password": "StaffPass#008",
    "role": "staff",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Associate Professor",
    "specialization": "Bioinformatics & Genetic Engineering",
    "phone": "+91-9840112208",
    "office_room": "BIO-305",
    "assigned_club": "Biotech Research Society"
  },
  {
    "user_id": "STF009",
    "registration_id": "STF009",
    "name": "Dr. Harish Chandra",
    "email": "harish.chandra@college.edu",
    "password": "StaffPass#009",
    "role": "staff",
    "department": "Management Studies",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Professor",
    "specialization": "Operations & Event Logistics",
    "phone": "+91-9840112209",
    "office_room": "MBA-401",
    "assigned_club": "Management Guild"
  },
  {
    "user_id": "STF010",
    "registration_id": "STF010",
    "name": "Prof. Shalini Roy",
    "email": "shalini.roy@college.edu",
    "password": "StaffPass#010",
    "role": "staff",
    "department": "Humanities and Sciences",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Assistant Professor",
    "specialization": "Professional Communication & Ethics",
    "phone": "+91-9840112210",
    "office_room": "HUM-103",
    "assigned_club": "Literary & Debating Society"
  },
  {
    "user_id": "STF011",
    "registration_id": "STF011",
    "name": "Dr. Amitesh Verma",
    "email": "amitesh.verma@college.edu",
    "password": "StaffPass#011",
    "role": "staff",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Assistant Professor",
    "specialization": "Full Stack Development & DevOps",
    "phone": "+91-9840112211",
    "office_room": "CSE-308",
    "assigned_club": "Open Source Developers Community"
  },
  {
    "user_id": "STF012",
    "registration_id": "STF012",
    "name": "Prof. Lakshmi Narayan",
    "email": "lakshmi.narayan@college.edu",
    "password": "StaffPass#012",
    "role": "staff",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Assistant Professor",
    "specialization": "IoT & Embedded Systems",
    "phone": "+91-9840112212",
    "office_room": "ECE-206",
    "assigned_club": "Hardware Hackers Club"
  },
  {
    "user_id": "STF013",
    "registration_id": "STF013",
    "name": "Dr. G. Senthil Kumar",
    "email": "senthil.kumar@college.edu",
    "password": "StaffPass#013",
    "role": "staff",
    "department": "Physical Education",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Director of Physical Education",
    "specialization": "Sports Management & Athletics",
    "phone": "+91-9840112213",
    "office_room": "SPT-001",
    "assigned_club": "Sports Council"
  },
  {
    "user_id": "STF014",
    "registration_id": "STF014",
    "name": "Prof. Rita Ghosh",
    "email": "rita.ghosh@college.edu",
    "password": "StaffPass#014",
    "role": "staff",
    "department": "Fine Arts and Culture",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Cultural Affairs Coordinator",
    "specialization": "Performing Arts & Stage Production",
    "phone": "+91-9840112214",
    "office_room": "AUD-104",
    "assigned_club": "Music & Dance Troupe"
  },
  {
    "user_id": "STF015",
    "registration_id": "STF015",
    "name": "Dr. Naveen Hegde",
    "email": "naveen.hegde@college.edu",
    "password": "StaffPass#015",
    "role": "staff",
    "department": "Student Affairs",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "designation": "Dean of Student Affairs",
    "specialization": "Student Governance & Grievance",
    "phone": "+91-9840112215",
    "office_room": "ADM-205",
    "assigned_club": "Rotaract Club"
  },
  {
    "user_id": "STU001",
    "registration_id": "STU001",
    "name": "Aarav Sharma",
    "email": "aarav.sharma1@student.college.edu",
    "password": "StudentPass#001",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710000101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false,
    "attendance_pct": 78
  },
  {
    "user_id": "STU002",
    "registration_id": "STU002",
    "name": "Aditi Verma",
    "email": "aditi.verma2@student.college.edu",
    "password": "StudentPass#002",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710000201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false,
    "attendance_pct": 81
  },
  {
    "user_id": "STU003",
    "registration_id": "STU003",
    "name": "Advait Gupta",
    "email": "advait.gupta3@student.college.edu",
    "password": "StudentPass#003",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710000301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": true,
    "attendance_pct": 84
  },
  {
    "user_id": "STU004",
    "registration_id": "STU004",
    "name": "Akash Patel",
    "email": "akash.patel4@student.college.edu",
    "password": "StudentPass#004",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710000401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 87
  },
  {
    "user_id": "STU005",
    "registration_id": "STU005",
    "name": "Ananya Reddy",
    "email": "ananya.reddy5@student.college.edu",
    "password": "StudentPass#005",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710000501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false,
    "attendance_pct": 90
  },
  {
    "user_id": "STU006",
    "registration_id": "STU006",
    "name": "Aniket Nair",
    "email": "aniket.nair6@student.college.edu",
    "password": "StudentPass#006",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710000601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": true,
    "attendance_pct": 93
  },
  {
    "user_id": "STU007",
    "registration_id": "STU007",
    "name": "Anushka Iyer",
    "email": "anushka.iyer7@student.college.edu",
    "password": "StudentPass#007",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710000701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false,
    "attendance_pct": 96
  },
  {
    "user_id": "STU008",
    "registration_id": "STU008",
    "name": "Arjun Rao",
    "email": "arjun.rao8@student.college.edu",
    "password": "StudentPass#008",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710000801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 76
  },
  {
    "user_id": "STU009",
    "registration_id": "STU009",
    "name": "Aryan Mehta",
    "email": "aryan.mehta9@student.college.edu",
    "password": "StudentPass#009",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710000901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": true,
    "attendance_pct": 79
  },
  {
    "user_id": "STU010",
    "registration_id": "STU010",
    "name": "Ayush Joshi",
    "email": "ayush.joshi10@student.college.edu",
    "password": "StudentPass#010",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710001001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false,
    "attendance_pct": 82
  },
  {
    "user_id": "STU011",
    "registration_id": "STU011",
    "name": "Bhavya Bhat",
    "email": "bhavya.bhat11@student.college.edu",
    "password": "StudentPass#011",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710001101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false,
    "attendance_pct": 85
  },
  {
    "user_id": "STU012",
    "registration_id": "STU012",
    "name": "Chetan Singh",
    "email": "chetan.singh12@student.college.edu",
    "password": "StudentPass#012",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710001201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": true,
    "attendance_pct": 88
  },
  {
    "user_id": "STU013",
    "registration_id": "STU013",
    "name": "Deepak Kumar",
    "email": "deepak.kumar13@student.college.edu",
    "password": "StudentPass#013",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710001301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 91
  },
  {
    "user_id": "STU014",
    "registration_id": "STU014",
    "name": "Dev Chopra",
    "email": "dev.chopra14@student.college.edu",
    "password": "StudentPass#014",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710001401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 94
  },
  {
    "user_id": "STU015",
    "registration_id": "STU015",
    "name": "Divya Das",
    "email": "divya.das15@student.college.edu",
    "password": "StudentPass#015",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710001501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": true,
    "attendance_pct": 97
  },
  {
    "user_id": "STU016",
    "registration_id": "STU016",
    "name": "Gaurav Banerjee",
    "email": "gaurav.banerjee16@student.college.edu",
    "password": "StudentPass#016",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710001601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false,
    "attendance_pct": 77
  },
  {
    "user_id": "STU017",
    "registration_id": "STU017",
    "name": "Gayatri Mishra",
    "email": "gayatri.mishra17@student.college.edu",
    "password": "StudentPass#017",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710001701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false,
    "attendance_pct": 80
  },
  {
    "user_id": "STU018",
    "registration_id": "STU018",
    "name": "Harsh Pandey",
    "email": "harsh.pandey18@student.college.edu",
    "password": "StudentPass#018",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710001801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": true,
    "attendance_pct": 83
  },
  {
    "user_id": "STU019",
    "registration_id": "STU019",
    "name": "Ishaan Saxena",
    "email": "ishaan.saxena19@student.college.edu",
    "password": "StudentPass#019",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710001901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 86
  },
  {
    "user_id": "STU020",
    "registration_id": "STU020",
    "name": "Ishita Deshmukh",
    "email": "ishita.deshmukh20@student.college.edu",
    "password": "StudentPass#020",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710002001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false,
    "attendance_pct": 89
  },
  {
    "user_id": "STU021",
    "registration_id": "STU021",
    "name": "Jay Choudhury",
    "email": "jay.choudhury21@student.college.edu",
    "password": "StudentPass#021",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710002101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": true,
    "attendance_pct": 92
  },
  {
    "user_id": "STU022",
    "registration_id": "STU022",
    "name": "Jhanvi Pillai",
    "email": "jhanvi.pillai22@student.college.edu",
    "password": "StudentPass#022",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710002201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false,
    "attendance_pct": 95
  },
  {
    "user_id": "STU023",
    "registration_id": "STU023",
    "name": "Karan Menon",
    "email": "karan.menon23@student.college.edu",
    "password": "StudentPass#023",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710002301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 75
  },
  {
    "user_id": "STU024",
    "registration_id": "STU024",
    "name": "Kavya Kapoor",
    "email": "kavya.kapoor24@student.college.edu",
    "password": "StudentPass#024",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710002401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": true,
    "attendance_pct": 78
  },
  {
    "user_id": "STU025",
    "registration_id": "STU025",
    "name": "Kunal Aggarwal",
    "email": "kunal.aggarwal25@student.college.edu",
    "password": "StudentPass#025",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710002501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false,
    "attendance_pct": 81
  },
  {
    "user_id": "STU026",
    "registration_id": "STU026",
    "name": "Laksh Kulkarni",
    "email": "laksh.kulkarni26@student.college.edu",
    "password": "StudentPass#026",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710002601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false,
    "attendance_pct": 84
  },
  {
    "user_id": "STU027",
    "registration_id": "STU027",
    "name": "Madhuri Jain",
    "email": "madhuri.jain27@student.college.edu",
    "password": "StudentPass#027",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710002701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": true,
    "attendance_pct": 87
  },
  {
    "user_id": "STU028",
    "registration_id": "STU028",
    "name": "Manish Bose",
    "email": "manish.bose28@student.college.edu",
    "password": "StudentPass#028",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710002801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 90
  },
  {
    "user_id": "STU029",
    "registration_id": "STU029",
    "name": "Manvi Dutta",
    "email": "manvi.dutta29@student.college.edu",
    "password": "StudentPass#029",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710002901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 93
  },
  {
    "user_id": "STU030",
    "registration_id": "STU030",
    "name": "Mohit Bhattacharya",
    "email": "mohit.bhattacharya30@student.college.edu",
    "password": "StudentPass#030",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710003001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": true,
    "attendance_pct": 96
  },
  {
    "user_id": "STU031",
    "registration_id": "STU031",
    "name": "Neha Srinivasan",
    "email": "neha.srinivasan31@student.college.edu",
    "password": "StudentPass#031",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710003101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false,
    "attendance_pct": 76
  },
  {
    "user_id": "STU032",
    "registration_id": "STU032",
    "name": "Nikhil Venkatesh",
    "email": "nikhil.venkatesh32@student.college.edu",
    "password": "StudentPass#032",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710003201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false,
    "attendance_pct": 79
  },
  {
    "user_id": "STU033",
    "registration_id": "STU033",
    "name": "Nisha Ranganathan",
    "email": "nisha.ranganathan33@student.college.edu",
    "password": "StudentPass#033",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710003301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": true,
    "attendance_pct": 82
  },
  {
    "user_id": "STU034",
    "registration_id": "STU034",
    "name": "Om Naik",
    "email": "om.naik34@student.college.edu",
    "password": "StudentPass#034",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710003401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 85
  },
  {
    "user_id": "STU035",
    "registration_id": "STU035",
    "name": "Pallavi Shetty",
    "email": "pallavi.shetty35@student.college.edu",
    "password": "StudentPass#035",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710003501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false,
    "attendance_pct": 88
  },
  {
    "user_id": "STU036",
    "registration_id": "STU036",
    "name": "Pooja Gowda",
    "email": "pooja.gowda36@student.college.edu",
    "password": "StudentPass#036",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710003601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": true,
    "attendance_pct": 91
  },
  {
    "user_id": "STU037",
    "registration_id": "STU037",
    "name": "Pranav Hegde",
    "email": "pranav.hegde37@student.college.edu",
    "password": "StudentPass#037",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710003701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false,
    "attendance_pct": 94
  },
  {
    "user_id": "STU038",
    "registration_id": "STU038",
    "name": "Prateek Purohit",
    "email": "prateek.purohit38@student.college.edu",
    "password": "StudentPass#038",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710003801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 97
  },
  {
    "user_id": "STU039",
    "registration_id": "STU039",
    "name": "Priya Tripathi",
    "email": "priya.tripathi39@student.college.edu",
    "password": "StudentPass#039",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710003901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": true,
    "attendance_pct": 77
  },
  {
    "user_id": "STU040",
    "registration_id": "STU040",
    "name": "Rahul Dubey",
    "email": "rahul.dubey40@student.college.edu",
    "password": "StudentPass#040",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710004001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false,
    "attendance_pct": 80
  },
  {
    "user_id": "STU041",
    "registration_id": "STU041",
    "name": "Rashi Tiwari",
    "email": "rashi.tiwari41@student.college.edu",
    "password": "StudentPass#041",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710004101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false,
    "attendance_pct": 83
  },
  {
    "user_id": "STU042",
    "registration_id": "STU042",
    "name": "Rhea Yadav",
    "email": "rhea.yadav42@student.college.edu",
    "password": "StudentPass#042",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710004201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": true,
    "attendance_pct": 86
  },
  {
    "user_id": "STU043",
    "registration_id": "STU043",
    "name": "Rishi Thakur",
    "email": "rishi.thakur43@student.college.edu",
    "password": "StudentPass#043",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710004301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 89
  },
  {
    "user_id": "STU044",
    "registration_id": "STU044",
    "name": "Ritika Chauhan",
    "email": "ritika.chauhan44@student.college.edu",
    "password": "StudentPass#044",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710004401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 92
  },
  {
    "user_id": "STU045",
    "registration_id": "STU045",
    "name": "Rohan Bhardwaj",
    "email": "rohan.bhardwaj45@student.college.edu",
    "password": "StudentPass#045",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710004501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": true,
    "attendance_pct": 95
  },
  {
    "user_id": "STU046",
    "registration_id": "STU046",
    "name": "Rohit Goswami",
    "email": "rohit.goswami46@student.college.edu",
    "password": "StudentPass#046",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710004601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false,
    "attendance_pct": 75
  },
  {
    "user_id": "STU047",
    "registration_id": "STU047",
    "name": "Roshni Sen",
    "email": "roshni.sen47@student.college.edu",
    "password": "StudentPass#047",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710004701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false,
    "attendance_pct": 78
  },
  {
    "user_id": "STU048",
    "registration_id": "STU048",
    "name": "Sahil Roy",
    "email": "sahil.roy48@student.college.edu",
    "password": "StudentPass#048",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710004801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": true,
    "attendance_pct": 81
  },
  {
    "user_id": "STU049",
    "registration_id": "STU049",
    "name": "Sakshi Mukherjee",
    "email": "sakshi.mukherjee49@student.college.edu",
    "password": "StudentPass#049",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710004901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 84
  },
  {
    "user_id": "STU050",
    "registration_id": "STU050",
    "name": "Sameer Chatterjee",
    "email": "sameer.chatterjee50@student.college.edu",
    "password": "StudentPass#050",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710005001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false,
    "attendance_pct": 87
  },
  {
    "user_id": "STU051",
    "registration_id": "STU051",
    "name": "Sanchit Ghosal",
    "email": "sanchit.ghosal51@student.college.edu",
    "password": "StudentPass#051",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710005101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": true,
    "attendance_pct": 90
  },
  {
    "user_id": "STU052",
    "registration_id": "STU052",
    "name": "Sanjana Basu",
    "email": "sanjana.basu52@student.college.edu",
    "password": "StudentPass#052",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710005201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false,
    "attendance_pct": 93
  },
  {
    "user_id": "STU053",
    "registration_id": "STU053",
    "name": "Sarthak Ghosh",
    "email": "sarthak.ghosh53@student.college.edu",
    "password": "StudentPass#053",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710005301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 96
  },
  {
    "user_id": "STU054",
    "registration_id": "STU054",
    "name": "Shalini Paul",
    "email": "shalini.paul54@student.college.edu",
    "password": "StudentPass#054",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710005401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": true,
    "attendance_pct": 76
  },
  {
    "user_id": "STU055",
    "registration_id": "STU055",
    "name": "Shivam Sarkar",
    "email": "shivam.sarkar55@student.college.edu",
    "password": "StudentPass#055",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710005501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false,
    "attendance_pct": 79
  },
  {
    "user_id": "STU056",
    "registration_id": "STU056",
    "name": "Shreya Majumdar",
    "email": "shreya.majumdar56@student.college.edu",
    "password": "StudentPass#056",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710005601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false,
    "attendance_pct": 82
  },
  {
    "user_id": "STU057",
    "registration_id": "STU057",
    "name": "Siddharth Chakraborty",
    "email": "siddharth.chakraborty57@student.college.edu",
    "password": "StudentPass#057",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710005701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": true,
    "attendance_pct": 85
  },
  {
    "user_id": "STU058",
    "registration_id": "STU058",
    "name": "Simran Sengupta",
    "email": "simran.sengupta58@student.college.edu",
    "password": "StudentPass#058",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710005801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 88
  },
  {
    "user_id": "STU059",
    "registration_id": "STU059",
    "name": "Sneha Dasgupta",
    "email": "sneha.dasgupta59@student.college.edu",
    "password": "StudentPass#059",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710005901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 91
  },
  {
    "user_id": "STU060",
    "registration_id": "STU060",
    "name": "Soham Mitra",
    "email": "soham.mitra60@student.college.edu",
    "password": "StudentPass#060",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710006001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": true,
    "attendance_pct": 94
  },
  {
    "user_id": "STU061",
    "registration_id": "STU061",
    "name": "Sonali Saha",
    "email": "sonali.saha61@student.college.edu",
    "password": "StudentPass#061",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710006101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false,
    "attendance_pct": 97
  },
  {
    "user_id": "STU062",
    "registration_id": "STU062",
    "name": "Sparsh Barman",
    "email": "sparsh.barman62@student.college.edu",
    "password": "StudentPass#062",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710006201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false,
    "attendance_pct": 77
  },
  {
    "user_id": "STU063",
    "registration_id": "STU063",
    "name": "Srishti Dhar",
    "email": "srishti.dhar63@student.college.edu",
    "password": "StudentPass#063",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710006301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": true,
    "attendance_pct": 80
  },
  {
    "user_id": "STU064",
    "registration_id": "STU064",
    "name": "Suraj Nath",
    "email": "suraj.nath64@student.college.edu",
    "password": "StudentPass#064",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710006401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 83
  },
  {
    "user_id": "STU065",
    "registration_id": "STU065",
    "name": "Tanvi Kashyap",
    "email": "tanvi.kashyap65@student.college.edu",
    "password": "StudentPass#065",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710006501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false,
    "attendance_pct": 86
  },
  {
    "user_id": "STU066",
    "registration_id": "STU066",
    "name": "Tarun Prasad",
    "email": "tarun.prasad66@student.college.edu",
    "password": "StudentPass#066",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710006601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": true,
    "attendance_pct": 89
  },
  {
    "user_id": "STU067",
    "registration_id": "STU067",
    "name": "Tejas Sinha",
    "email": "tejas.sinha67@student.college.edu",
    "password": "StudentPass#067",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710006701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false,
    "attendance_pct": 92
  },
  {
    "user_id": "STU068",
    "registration_id": "STU068",
    "name": "Trisha Shukla",
    "email": "trisha.shukla68@student.college.edu",
    "password": "StudentPass#068",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710006801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 95
  },
  {
    "user_id": "STU069",
    "registration_id": "STU069",
    "name": "Tushar Pandit",
    "email": "tushar.pandit69@student.college.edu",
    "password": "StudentPass#069",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710006901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": true,
    "attendance_pct": 75
  },
  {
    "user_id": "STU070",
    "registration_id": "STU070",
    "name": "Utkarsh Rastogi",
    "email": "utkarsh.rastogi70@student.college.edu",
    "password": "StudentPass#070",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710007001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false,
    "attendance_pct": 78
  },
  {
    "user_id": "STU071",
    "registration_id": "STU071",
    "name": "Vaibhav Srivastava",
    "email": "vaibhav.srivastava71@student.college.edu",
    "password": "StudentPass#071",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710007101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false,
    "attendance_pct": 81
  },
  {
    "user_id": "STU072",
    "registration_id": "STU072",
    "name": "Vaishnavi Dewan",
    "email": "vaishnavi.dewan72@student.college.edu",
    "password": "StudentPass#072",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710007201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": true,
    "attendance_pct": 84
  },
  {
    "user_id": "STU073",
    "registration_id": "STU073",
    "name": "Varun Anand",
    "email": "varun.anand73@student.college.edu",
    "password": "StudentPass#073",
    "role": "student",
    "department": "Computer Science and Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710007301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 87
  },
  {
    "user_id": "STU074",
    "registration_id": "STU074",
    "name": "Vedant Nigam",
    "email": "vedant.nigam74@student.college.edu",
    "password": "StudentPass#074",
    "role": "student",
    "department": "Artificial Intelligence & Data Science",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710007401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false,
    "attendance_pct": 90
  },
  {
    "user_id": "STU075",
    "registration_id": "STU075",
    "name": "Vidhi Biswas",
    "email": "vidhi.biswas75@student.college.edu",
    "password": "StudentPass#075",
    "role": "student",
    "department": "Electronics and Communication Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710007501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": true,
    "attendance_pct": 93
  },
  {
    "user_id": "STU076",
    "registration_id": "STU076",
    "name": "Vikas Bhatt",
    "email": "vikas.bhatt76@student.college.edu",
    "password": "StudentPass#076",
    "role": "student",
    "department": "Information Technology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710007601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false,
    "attendance_pct": 96
  },
  {
    "user_id": "STU077",
    "registration_id": "STU077",
    "name": "Vinay Mahajan",
    "email": "vinay.mahajan77@student.college.edu",
    "password": "StudentPass#077",
    "role": "student",
    "department": "Electrical and Electronics Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710007701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false,
    "attendance_pct": 76
  },
  {
    "user_id": "STU078",
    "registration_id": "STU078",
    "name": "Vipin Khatri",
    "email": "vipin.khatri78@student.college.edu",
    "password": "StudentPass#078",
    "role": "student",
    "department": "Mechanical Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710007801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": true,
    "attendance_pct": 79
  },
  {
    "user_id": "STU079",
    "registration_id": "STU079",
    "name": "Yash Soni",
    "email": "yash.soni79@student.college.edu",
    "password": "StudentPass#079",
    "role": "student",
    "department": "Biotechnology",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710007901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false,
    "attendance_pct": 82
  },
  {
    "user_id": "STU080",
    "registration_id": "STU080",
    "name": "Yukta Surana",
    "email": "yukta.surana80@student.college.edu",
    "password": "StudentPass#080",
    "role": "student",
    "department": "Civil Engineering",
    "status": "ACTIVE",
    "created_at": "2026-08-21T08:00:00Z",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710008001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false,
    "attendance_pct": 85
  }
];

const DEFAULT_STAFF = [
  {
    "user_id": "STF001",
    "registration_id": "STF001",
    "name": "Prof. Rajesh Raman",
    "password": "StaffPass#001",
    "role": "staff",
    "email": "rajesh.raman@college.edu",
    "department": "Computer Science and Engineering",
    "designation": "Professor & Head",
    "specialization": "Artificial Intelligence & Distributed Systems",
    "phone": "+91-9840112201",
    "office_room": "CSE-301",
    "assigned_club": "ACM Student Chapter"
  },
  {
    "user_id": "STF002",
    "registration_id": "STF002",
    "name": "Dr. Meenakshi Sundaram",
    "password": "StaffPass#002",
    "role": "staff",
    "email": "meenakshi.s@college.edu",
    "department": "Electronics and Communication Engineering",
    "designation": "Professor & Head",
    "specialization": "VLSI & Signal Processing",
    "phone": "+91-9840112202",
    "office_room": "ECE-201",
    "assigned_club": "IEEE Student Branch"
  },
  {
    "user_id": "STF003",
    "registration_id": "STF003",
    "name": "Dr. Vikramaditya Sen",
    "password": "StaffPass#003",
    "role": "staff",
    "email": "vikram.sen@college.edu",
    "department": "Mechanical Engineering",
    "designation": "Professor & Head",
    "specialization": "Robotics & Thermal Systems",
    "phone": "+91-9840112203",
    "office_room": "MECH-101",
    "assigned_club": "SAE Collegiate Club"
  },
  {
    "user_id": "STF004",
    "registration_id": "STF004",
    "name": "Dr. Ananya Deshmukh",
    "password": "StaffPass#004",
    "role": "staff",
    "email": "ananya.deshmukh@college.edu",
    "department": "Artificial Intelligence & Data Science",
    "designation": "Associate Professor",
    "specialization": "Deep Learning & NLP",
    "phone": "+91-9840112204",
    "office_room": "AI-105",
    "assigned_club": "AI Innovators Club"
  },
  {
    "user_id": "STF005",
    "registration_id": "STF005",
    "name": "Prof. K. R. Balaji",
    "password": "StaffPass#005",
    "role": "staff",
    "email": "kr.balaji@college.edu",
    "department": "Electrical and Electronics Engineering",
    "designation": "Associate Professor",
    "specialization": "Renewable Energy & Smart Grids",
    "phone": "+91-9840112205",
    "office_room": "EEE-204",
    "assigned_club": "Green Energy Forum"
  },
  {
    "user_id": "STF006",
    "registration_id": "STF006",
    "name": "Dr. Sunita Kulkarni",
    "password": "StaffPass#006",
    "role": "staff",
    "email": "sunita.kulkarni@college.edu",
    "department": "Information Technology",
    "designation": "Associate Professor",
    "specialization": "Cloud Computing & Cybersecurity",
    "phone": "+91-9840112206",
    "office_room": "IT-208",
    "assigned_club": "Cyber Security Cell"
  },
  {
    "user_id": "STF007",
    "registration_id": "STF007",
    "name": "Prof. David V. Thomas",
    "password": "StaffPass#007",
    "role": "staff",
    "email": "david.thomas@college.edu",
    "department": "Civil Engineering",
    "designation": "Assistant Professor",
    "specialization": "Structural Analysis & Geo-Tech",
    "phone": "+91-9840112207",
    "office_room": "CIV-102",
    "assigned_club": "Eco-Builders Club"
  },
  {
    "user_id": "STF008",
    "registration_id": "STF008",
    "name": "Dr. Priya Nambiar",
    "password": "StaffPass#008",
    "role": "staff",
    "email": "priya.nambiar@college.edu",
    "department": "Biotechnology",
    "designation": "Associate Professor",
    "specialization": "Bioinformatics & Genetic Engineering",
    "phone": "+91-9840112208",
    "office_room": "BIO-305",
    "assigned_club": "Biotech Research Society"
  },
  {
    "user_id": "STF009",
    "registration_id": "STF009",
    "name": "Dr. Harish Chandra",
    "password": "StaffPass#009",
    "role": "staff",
    "email": "harish.chandra@college.edu",
    "department": "Management Studies",
    "designation": "Professor",
    "specialization": "Operations & Event Logistics",
    "phone": "+91-9840112209",
    "office_room": "MBA-401",
    "assigned_club": "Management Guild"
  },
  {
    "user_id": "STF010",
    "registration_id": "STF010",
    "name": "Prof. Shalini Roy",
    "password": "StaffPass#010",
    "role": "staff",
    "email": "shalini.roy@college.edu",
    "department": "Humanities and Sciences",
    "designation": "Assistant Professor",
    "specialization": "Professional Communication & Ethics",
    "phone": "+91-9840112210",
    "office_room": "HUM-103",
    "assigned_club": "Literary & Debating Society"
  },
  {
    "user_id": "STF011",
    "registration_id": "STF011",
    "name": "Dr. Amitesh Verma",
    "password": "StaffPass#011",
    "role": "staff",
    "email": "amitesh.verma@college.edu",
    "department": "Computer Science and Engineering",
    "designation": "Assistant Professor",
    "specialization": "Full Stack Development & DevOps",
    "phone": "+91-9840112211",
    "office_room": "CSE-308",
    "assigned_club": "Open Source Developers Community"
  },
  {
    "user_id": "STF012",
    "registration_id": "STF012",
    "name": "Prof. Lakshmi Narayan",
    "password": "StaffPass#012",
    "role": "staff",
    "email": "lakshmi.narayan@college.edu",
    "department": "Electronics and Communication Engineering",
    "designation": "Assistant Professor",
    "specialization": "IoT & Embedded Systems",
    "phone": "+91-9840112212",
    "office_room": "ECE-206",
    "assigned_club": "Hardware Hackers Club"
  },
  {
    "user_id": "STF013",
    "registration_id": "STF013",
    "name": "Dr. G. Senthil Kumar",
    "password": "StaffPass#013",
    "role": "staff",
    "email": "senthil.kumar@college.edu",
    "department": "Physical Education",
    "designation": "Director of Physical Education",
    "specialization": "Sports Management & Athletics",
    "phone": "+91-9840112213",
    "office_room": "SPT-001",
    "assigned_club": "Sports Council"
  },
  {
    "user_id": "STF014",
    "registration_id": "STF014",
    "name": "Prof. Rita Ghosh",
    "password": "StaffPass#014",
    "role": "staff",
    "email": "rita.ghosh@college.edu",
    "department": "Fine Arts and Culture",
    "designation": "Cultural Affairs Coordinator",
    "specialization": "Performing Arts & Stage Production",
    "phone": "+91-9840112214",
    "office_room": "AUD-104",
    "assigned_club": "Music & Dance Troupe"
  },
  {
    "user_id": "STF015",
    "registration_id": "STF015",
    "name": "Dr. Naveen Hegde",
    "password": "StaffPass#015",
    "role": "staff",
    "email": "naveen.hegde@college.edu",
    "department": "Student Affairs",
    "designation": "Dean of Student Affairs",
    "specialization": "Student Governance & Grievance",
    "phone": "+91-9840112215",
    "office_room": "ADM-205",
    "assigned_club": "Rotaract Club"
  }
];

const DEFAULT_STUDENTS = [
  {
    "user_id": "STU001",
    "registration_id": "STU001",
    "name": "Aarav Sharma",
    "password": "StudentPass#001",
    "role": "student",
    "email": "aarav.sharma1@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710000101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU002",
    "registration_id": "STU002",
    "name": "Aditi Verma",
    "password": "StudentPass#002",
    "role": "student",
    "email": "aditi.verma2@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710000201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU003",
    "registration_id": "STU003",
    "name": "Advait Gupta",
    "password": "StudentPass#003",
    "role": "student",
    "email": "advait.gupta3@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710000301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU004",
    "registration_id": "STU004",
    "name": "Akash Patel",
    "password": "StudentPass#004",
    "role": "student",
    "email": "akash.patel4@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710000401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU005",
    "registration_id": "STU005",
    "name": "Ananya Reddy",
    "password": "StudentPass#005",
    "role": "student",
    "email": "ananya.reddy5@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710000501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU006",
    "registration_id": "STU006",
    "name": "Aniket Nair",
    "password": "StudentPass#006",
    "role": "student",
    "email": "aniket.nair6@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710000601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU007",
    "registration_id": "STU007",
    "name": "Anushka Iyer",
    "password": "StudentPass#007",
    "role": "student",
    "email": "anushka.iyer7@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710000701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU008",
    "registration_id": "STU008",
    "name": "Arjun Rao",
    "password": "StudentPass#008",
    "role": "student",
    "email": "arjun.rao8@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710000801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU009",
    "registration_id": "STU009",
    "name": "Aryan Mehta",
    "password": "StudentPass#009",
    "role": "student",
    "email": "aryan.mehta9@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710000901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU010",
    "registration_id": "STU010",
    "name": "Ayush Joshi",
    "password": "StudentPass#010",
    "role": "student",
    "email": "ayush.joshi10@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710001001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU011",
    "registration_id": "STU011",
    "name": "Bhavya Bhat",
    "password": "StudentPass#011",
    "role": "student",
    "email": "bhavya.bhat11@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710001101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU012",
    "registration_id": "STU012",
    "name": "Chetan Singh",
    "password": "StudentPass#012",
    "role": "student",
    "email": "chetan.singh12@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710001201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU013",
    "registration_id": "STU013",
    "name": "Deepak Kumar",
    "password": "StudentPass#013",
    "role": "student",
    "email": "deepak.kumar13@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710001301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU014",
    "registration_id": "STU014",
    "name": "Dev Chopra",
    "password": "StudentPass#014",
    "role": "student",
    "email": "dev.chopra14@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710001401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU015",
    "registration_id": "STU015",
    "name": "Divya Das",
    "password": "StudentPass#015",
    "role": "student",
    "email": "divya.das15@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710001501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU016",
    "registration_id": "STU016",
    "name": "Gaurav Banerjee",
    "password": "StudentPass#016",
    "role": "student",
    "email": "gaurav.banerjee16@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710001601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU017",
    "registration_id": "STU017",
    "name": "Gayatri Mishra",
    "password": "StudentPass#017",
    "role": "student",
    "email": "gayatri.mishra17@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710001701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU018",
    "registration_id": "STU018",
    "name": "Harsh Pandey",
    "password": "StudentPass#018",
    "role": "student",
    "email": "harsh.pandey18@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710001801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU019",
    "registration_id": "STU019",
    "name": "Ishaan Saxena",
    "password": "StudentPass#019",
    "role": "student",
    "email": "ishaan.saxena19@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710001901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU020",
    "registration_id": "STU020",
    "name": "Ishita Deshmukh",
    "password": "StudentPass#020",
    "role": "student",
    "email": "ishita.deshmukh20@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710002001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU021",
    "registration_id": "STU021",
    "name": "Jay Choudhury",
    "password": "StudentPass#021",
    "role": "student",
    "email": "jay.choudhury21@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710002101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU022",
    "registration_id": "STU022",
    "name": "Jhanvi Pillai",
    "password": "StudentPass#022",
    "role": "student",
    "email": "jhanvi.pillai22@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710002201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU023",
    "registration_id": "STU023",
    "name": "Karan Menon",
    "password": "StudentPass#023",
    "role": "student",
    "email": "karan.menon23@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710002301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU024",
    "registration_id": "STU024",
    "name": "Kavya Kapoor",
    "password": "StudentPass#024",
    "role": "student",
    "email": "kavya.kapoor24@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710002401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU025",
    "registration_id": "STU025",
    "name": "Kunal Aggarwal",
    "password": "StudentPass#025",
    "role": "student",
    "email": "kunal.aggarwal25@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710002501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU026",
    "registration_id": "STU026",
    "name": "Laksh Kulkarni",
    "password": "StudentPass#026",
    "role": "student",
    "email": "laksh.kulkarni26@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710002601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU027",
    "registration_id": "STU027",
    "name": "Madhuri Jain",
    "password": "StudentPass#027",
    "role": "student",
    "email": "madhuri.jain27@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710002701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU028",
    "registration_id": "STU028",
    "name": "Manish Bose",
    "password": "StudentPass#028",
    "role": "student",
    "email": "manish.bose28@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710002801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU029",
    "registration_id": "STU029",
    "name": "Manvi Dutta",
    "password": "StudentPass#029",
    "role": "student",
    "email": "manvi.dutta29@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710002901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU030",
    "registration_id": "STU030",
    "name": "Mohit Bhattacharya",
    "password": "StudentPass#030",
    "role": "student",
    "email": "mohit.bhattacharya30@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710003001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU031",
    "registration_id": "STU031",
    "name": "Neha Srinivasan",
    "password": "StudentPass#031",
    "role": "student",
    "email": "neha.srinivasan31@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710003101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU032",
    "registration_id": "STU032",
    "name": "Nikhil Venkatesh",
    "password": "StudentPass#032",
    "role": "student",
    "email": "nikhil.venkatesh32@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710003201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU033",
    "registration_id": "STU033",
    "name": "Nisha Ranganathan",
    "password": "StudentPass#033",
    "role": "student",
    "email": "nisha.ranganathan33@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710003301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU034",
    "registration_id": "STU034",
    "name": "Om Naik",
    "password": "StudentPass#034",
    "role": "student",
    "email": "om.naik34@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710003401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU035",
    "registration_id": "STU035",
    "name": "Pallavi Shetty",
    "password": "StudentPass#035",
    "role": "student",
    "email": "pallavi.shetty35@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710003501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU036",
    "registration_id": "STU036",
    "name": "Pooja Gowda",
    "password": "StudentPass#036",
    "role": "student",
    "email": "pooja.gowda36@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710003601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU037",
    "registration_id": "STU037",
    "name": "Pranav Hegde",
    "password": "StudentPass#037",
    "role": "student",
    "email": "pranav.hegde37@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710003701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU038",
    "registration_id": "STU038",
    "name": "Prateek Purohit",
    "password": "StudentPass#038",
    "role": "student",
    "email": "prateek.purohit38@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710003801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU039",
    "registration_id": "STU039",
    "name": "Priya Tripathi",
    "password": "StudentPass#039",
    "role": "student",
    "email": "priya.tripathi39@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710003901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU040",
    "registration_id": "STU040",
    "name": "Rahul Dubey",
    "password": "StudentPass#040",
    "role": "student",
    "email": "rahul.dubey40@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710004001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU041",
    "registration_id": "STU041",
    "name": "Rashi Tiwari",
    "password": "StudentPass#041",
    "role": "student",
    "email": "rashi.tiwari41@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710004101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU042",
    "registration_id": "STU042",
    "name": "Rhea Yadav",
    "password": "StudentPass#042",
    "role": "student",
    "email": "rhea.yadav42@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710004201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU043",
    "registration_id": "STU043",
    "name": "Rishi Thakur",
    "password": "StudentPass#043",
    "role": "student",
    "email": "rishi.thakur43@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710004301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU044",
    "registration_id": "STU044",
    "name": "Ritika Chauhan",
    "password": "StudentPass#044",
    "role": "student",
    "email": "ritika.chauhan44@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710004401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU045",
    "registration_id": "STU045",
    "name": "Rohan Bhardwaj",
    "password": "StudentPass#045",
    "role": "student",
    "email": "rohan.bhardwaj45@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710004501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU046",
    "registration_id": "STU046",
    "name": "Rohit Goswami",
    "password": "StudentPass#046",
    "role": "student",
    "email": "rohit.goswami46@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710004601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU047",
    "registration_id": "STU047",
    "name": "Roshni Sen",
    "password": "StudentPass#047",
    "role": "student",
    "email": "roshni.sen47@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710004701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU048",
    "registration_id": "STU048",
    "name": "Sahil Roy",
    "password": "StudentPass#048",
    "role": "student",
    "email": "sahil.roy48@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710004801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU049",
    "registration_id": "STU049",
    "name": "Sakshi Mukherjee",
    "password": "StudentPass#049",
    "role": "student",
    "email": "sakshi.mukherjee49@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710004901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU050",
    "registration_id": "STU050",
    "name": "Sameer Chatterjee",
    "password": "StudentPass#050",
    "role": "student",
    "email": "sameer.chatterjee50@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710005001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU051",
    "registration_id": "STU051",
    "name": "Sanchit Ghosal",
    "password": "StudentPass#051",
    "role": "student",
    "email": "sanchit.ghosal51@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710005101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU052",
    "registration_id": "STU052",
    "name": "Sanjana Basu",
    "password": "StudentPass#052",
    "role": "student",
    "email": "sanjana.basu52@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710005201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU053",
    "registration_id": "STU053",
    "name": "Sarthak Ghosh",
    "password": "StudentPass#053",
    "role": "student",
    "email": "sarthak.ghosh53@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710005301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU054",
    "registration_id": "STU054",
    "name": "Shalini Paul",
    "password": "StudentPass#054",
    "role": "student",
    "email": "shalini.paul54@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710005401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU055",
    "registration_id": "STU055",
    "name": "Shivam Sarkar",
    "password": "StudentPass#055",
    "role": "student",
    "email": "shivam.sarkar55@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710005501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU056",
    "registration_id": "STU056",
    "name": "Shreya Majumdar",
    "password": "StudentPass#056",
    "role": "student",
    "email": "shreya.majumdar56@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710005601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU057",
    "registration_id": "STU057",
    "name": "Siddharth Chakraborty",
    "password": "StudentPass#057",
    "role": "student",
    "email": "siddharth.chakraborty57@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710005701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU058",
    "registration_id": "STU058",
    "name": "Simran Sengupta",
    "password": "StudentPass#058",
    "role": "student",
    "email": "simran.sengupta58@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710005801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU059",
    "registration_id": "STU059",
    "name": "Sneha Dasgupta",
    "password": "StudentPass#059",
    "role": "student",
    "email": "sneha.dasgupta59@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710005901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU060",
    "registration_id": "STU060",
    "name": "Soham Mitra",
    "password": "StudentPass#060",
    "role": "student",
    "email": "soham.mitra60@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710006001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU061",
    "registration_id": "STU061",
    "name": "Sonali Saha",
    "password": "StudentPass#061",
    "role": "student",
    "email": "sonali.saha61@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710006101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU062",
    "registration_id": "STU062",
    "name": "Sparsh Barman",
    "password": "StudentPass#062",
    "role": "student",
    "email": "sparsh.barman62@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710006201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU063",
    "registration_id": "STU063",
    "name": "Srishti Dhar",
    "password": "StudentPass#063",
    "role": "student",
    "email": "srishti.dhar63@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710006301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU064",
    "registration_id": "STU064",
    "name": "Suraj Nath",
    "password": "StudentPass#064",
    "role": "student",
    "email": "suraj.nath64@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710006401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU065",
    "registration_id": "STU065",
    "name": "Tanvi Kashyap",
    "password": "StudentPass#065",
    "role": "student",
    "email": "tanvi.kashyap65@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710006501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU066",
    "registration_id": "STU066",
    "name": "Tarun Prasad",
    "password": "StudentPass#066",
    "role": "student",
    "email": "tarun.prasad66@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710006601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU067",
    "registration_id": "STU067",
    "name": "Tejas Sinha",
    "password": "StudentPass#067",
    "role": "student",
    "email": "tejas.sinha67@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710006701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU068",
    "registration_id": "STU068",
    "name": "Trisha Shukla",
    "password": "StudentPass#068",
    "role": "student",
    "email": "trisha.shukla68@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710006801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU069",
    "registration_id": "STU069",
    "name": "Tushar Pandit",
    "password": "StudentPass#069",
    "role": "student",
    "email": "tushar.pandit69@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "C",
    "phone": "+91-9710006901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU070",
    "registration_id": "STU070",
    "name": "Utkarsh Rastogi",
    "password": "StudentPass#070",
    "role": "student",
    "email": "utkarsh.rastogi70@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "A",
    "phone": "+91-9710007001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU071",
    "registration_id": "STU071",
    "name": "Vaibhav Srivastava",
    "password": "StudentPass#071",
    "role": "student",
    "email": "vaibhav.srivastava71@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "B",
    "phone": "+91-9710007101",
    "club_memberships": [
      "Coding Club",
      "Web3 Guild"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU072",
    "registration_id": "STU072",
    "name": "Vaishnavi Dewan",
    "password": "StudentPass#072",
    "role": "student",
    "email": "vaishnavi.dewan72@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "C",
    "phone": "+91-9710007201",
    "club_memberships": [
      "Robotics Club",
      "IoT Innovators"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU073",
    "registration_id": "STU073",
    "name": "Varun Anand",
    "password": "StudentPass#073",
    "role": "student",
    "email": "varun.anand73@student.college.edu",
    "department": "Computer Science and Engineering",
    "year_of_study": 1,
    "section": "A",
    "phone": "+91-9710007301",
    "club_memberships": [
      "AI Innovators Club",
      "Data Science Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU074",
    "registration_id": "STU074",
    "name": "Vedant Nigam",
    "password": "StudentPass#074",
    "role": "student",
    "email": "vedant.nigam74@student.college.edu",
    "department": "Artificial Intelligence & Data Science",
    "year_of_study": 2,
    "section": "B",
    "phone": "+91-9710007401",
    "club_memberships": [
      "Literary & Debating Society",
      "Rotaract Club"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU075",
    "registration_id": "STU075",
    "name": "Vidhi Biswas",
    "password": "StudentPass#075",
    "role": "student",
    "email": "vidhi.biswas75@student.college.edu",
    "department": "Electronics and Communication Engineering",
    "year_of_study": 3,
    "section": "C",
    "phone": "+91-9710007501",
    "club_memberships": [
      "IEEE Student Branch",
      "Hardware Hackers"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU076",
    "registration_id": "STU076",
    "name": "Vikas Bhatt",
    "password": "StudentPass#076",
    "role": "student",
    "email": "vikas.bhatt76@student.college.edu",
    "department": "Information Technology",
    "year_of_study": 4,
    "section": "A",
    "phone": "+91-9710007601",
    "club_memberships": [
      "ACM Student Chapter",
      "Open Source Community"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU077",
    "registration_id": "STU077",
    "name": "Vinay Mahajan",
    "password": "StudentPass#077",
    "role": "student",
    "email": "vinay.mahajan77@student.college.edu",
    "department": "Electrical and Electronics Engineering",
    "year_of_study": 1,
    "section": "B",
    "phone": "+91-9710007701",
    "club_memberships": [
      "Fine Arts Club",
      "Music & Dance Troupe"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU078",
    "registration_id": "STU078",
    "name": "Vipin Khatri",
    "password": "StudentPass#078",
    "role": "student",
    "email": "vipin.khatri78@student.college.edu",
    "department": "Mechanical Engineering",
    "year_of_study": 2,
    "section": "C",
    "phone": "+91-9710007801",
    "club_memberships": [
      "Sports Council",
      "Fitness Club"
    ],
    "is_volunteer": true
  },
  {
    "user_id": "STU079",
    "registration_id": "STU079",
    "name": "Yash Soni",
    "password": "StudentPass#079",
    "role": "student",
    "email": "yash.soni79@student.college.edu",
    "department": "Biotechnology",
    "year_of_study": 3,
    "section": "A",
    "phone": "+91-9710007901",
    "club_memberships": [
      "Eco-Builders Club",
      "Green Energy Forum"
    ],
    "is_volunteer": false
  },
  {
    "user_id": "STU080",
    "registration_id": "STU080",
    "name": "Yukta Surana",
    "password": "StudentPass#080",
    "role": "student",
    "email": "yukta.surana80@student.college.edu",
    "department": "Civil Engineering",
    "year_of_study": 4,
    "section": "B",
    "phone": "+91-9710008001",
    "club_memberships": [
      "Management Guild",
      "Entrepreneurship Cell"
    ],
    "is_volunteer": false
  }
];

const DEFAULT_VENUES = [
  {
    "venue_id": "VEN_AUD_001",
    "venue_name": "Dr. APJ Abdul Kalam Main Auditorium",
    "capacity": 850,
    "availability": true,
    "suitable_event_type": [
      "Technical Symposium",
      "Cultural Fest",
      "Annual Day",
      "Hackathon Inauguration",
      "International Conference"
    ],
    "location": "Central Block, Level 1",
    "facilities": [
      "Central Air Conditioning",
      "Line Array Audio System",
      "Dual 4K Projectors",
      "Green Rooms",
      "Backup Power Generator"
    ]
  },
  {
    "venue_id": "VEN_SEM_001",
    "venue_name": "Sir C.V. Raman Seminar Hall",
    "capacity": 250,
    "availability": true,
    "suitable_event_type": [
      "Workshop",
      "Faculty Development Program",
      "Guest Lecture",
      "Panel Discussion"
    ],
    "location": "Science Block, Level 2",
    "facilities": [
      "Air Conditioning",
      "PA System",
      "Smart Podium",
      "Ceiling Projector",
      "Wi-Fi Coverage"
    ]
  },
  {
    "venue_id": "VEN_LAB_001",
    "venue_name": "Alan Turing High Performance Computing Lab",
    "capacity": 120,
    "availability": true,
    "suitable_event_type": [
      "Hackathon",
      "Coding Competition",
      "Hands-on AI Workshop",
      "Project Demo"
    ],
    "location": "IT Tower, Level 3",
    "facilities": [
      "120 Workstations with GPU",
      "High-Speed Gigabit LAN",
      "Smart Display Board",
      "Air Conditioning",
      "UPS Power Backup"
    ]
  },
  {
    "venue_id": "VEN_OAT_001",
    "venue_name": "Open Air Theatre (OAT)",
    "capacity": 2000,
    "availability": true,
    "suitable_event_type": [
      "Cultural Night",
      "Music Concert",
      "College Day",
      "Alumni Reunion",
      "Street Play"
    ],
    "location": "Campus Grounds West",
    "facilities": [
      "Open Stage",
      "Floodlights",
      "Acoustic Stage Shell",
      "Amphitheatre Tiered Seating",
      "Backstage Dressing Rooms"
    ]
  },
  {
    "venue_id": "VEN_CNF_001",
    "venue_name": "Executive Board & Conference Room",
    "capacity": 50,
    "availability": true,
    "suitable_event_type": [
      "Executive Meeting",
      "Advisory Board Session",
      "VIP Guest Reception",
      "Jury Deliberation"
    ],
    "location": "Administrative Block, Level 2",
    "facilities": [
      "Video Conferencing Rig",
      "Sound Dampening Acoustics",
      "Roundtable Mics",
      "Executive Cushioned Seating",
      "Private Pantry"
    ]
  },
  {
    "venue_id": "VEN_SPT_001",
    "venue_name": "Major Dhyan Chand Indoor Sports Complex",
    "capacity": 600,
    "availability": true,
    "suitable_event_type": [
      "Inter-College Tournament",
      "Sports Meet",
      "Exhibition & Expo",
      "Mega Project Showcase"
    ],
    "location": "Sports Wing East",
    "facilities": [
      "Hardwood Court Flooring",
      "Scoreboards",
      "PA Announcer System",
      "Locker Rooms & Showers",
      "First Aid Room"
    ]
  },
  {
    "venue_id": "VEN_MECH_001",
    "venue_name": "CAD/CAM & Prototyping Workshop Hall",
    "capacity": 80,
    "availability": true,
    "suitable_event_type": [
      "Robotics Contest",
      "Hardware Hackathon",
      "Design Workshop",
      "Prototyping Boot Camp"
    ],
    "location": "Mechanical Block, Ground Floor",
    "facilities": [
      "3D Printers",
      "Power Tool Stations",
      "Exhaust Ventilation",
      "Overhead Projector",
      "Soldering Benches"
    ]
  },
  {
    "venue_id": "VEN_LIB_001",
    "venue_name": "Central Library Digital Learning Commons",
    "capacity": 100,
    "availability": true,
    "suitable_event_type": [
      "Paper Presentation",
      "Quiz Competition",
      "Book Reading & Discussion",
      "Research Symposium"
    ],
    "location": "Central Library, Level 1",
    "facilities": [
      "Quiet Zone Acoustic Paneling",
      "Digital Terminals",
      "Projector",
      "Wi-Fi Hub",
      "Reference Stacks"
    ]
  }
];

const DEFAULT_RESOURCES = [
  {
    "resource_id": "RES_PA_001",
    "resource_name": "Line Array PA Sound System & Digital Mixer (JBL 4000W)",
    "available_quantity": 4,
    "unit_cost": 3500,
    "availability": true,
    "category": "Audio-Visual",
    "storage_location": "AV Central Store, Aud Block Room 102"
  },
  {
    "resource_id": "RES_PRJ_001",
    "resource_name": "High-Lumen 4K Laser Projector (Epson 7000 Lumens)",
    "available_quantity": 8,
    "unit_cost": 2000,
    "availability": true,
    "category": "Audio-Visual",
    "storage_location": "AV Central Store, Aud Block Room 102"
  },
  {
    "resource_id": "RES_MIC_001",
    "resource_name": "Cordless UHF Collar & Handheld Microphone Set (Shure 4-Pack)",
    "available_quantity": 15,
    "unit_cost": 600,
    "availability": true,
    "category": "Audio-Visual",
    "storage_location": "AV Central Store, Aud Block Room 102"
  },
  {
    "resource_id": "RES_POD_001",
    "resource_name": "Digital Smart Podium with Interactive Display & Mic",
    "available_quantity": 5,
    "unit_cost": 1500,
    "availability": true,
    "category": "Stage Equipment",
    "storage_location": "Central Store, Admin Block Ground Floor"
  },
  {
    "resource_id": "RES_CHR_001",
    "resource_name": "High-Back Cushioned Banquet Chairs (Set of 50)",
    "available_quantity": 20,
    "unit_cost": 500,
    "availability": true,
    "category": "Furniture",
    "storage_location": "Logistics Warehouse, South Bay"
  },
  {
    "resource_id": "RES_TBL_001",
    "resource_name": "Standard Banquet Presentation Tables with Linen (6ft)",
    "available_quantity": 40,
    "unit_cost": 250,
    "availability": true,
    "category": "Furniture",
    "storage_location": "Logistics Warehouse, South Bay"
  },
  {
    "resource_id": "RES_LGT_001",
    "resource_name": "RGB Stage LED Par Can & Spotlight Rig System",
    "available_quantity": 6,
    "unit_cost": 2800,
    "availability": true,
    "category": "Lighting",
    "storage_location": "Electrical Maintenance Wing, Bay 3"
  },
  {
    "resource_id": "RES_PWR_001",
    "resource_name": "Heavy-Duty Surge Protected Multi-Plug Extension Hubs (30m)",
    "available_quantity": 30,
    "unit_cost": 150,
    "availability": true,
    "category": "Electrical",
    "storage_location": "Electrical Maintenance Wing, Bay 1"
  },
  {
    "resource_id": "RES_WIFI_001",
    "resource_name": "High-Density Portable Wi-Fi 6 Access Point Hub (Cisco)",
    "available_quantity": 10,
    "unit_cost": 1200,
    "availability": true,
    "category": "Networking",
    "storage_location": "IT Infrastructure Cell, Server Room B"
  },
  {
    "resource_id": "RES_BKG_001",
    "resource_name": "Adjustable Metal Backdrop Truss & Flex Banner Frame (20x10ft)",
    "available_quantity": 5,
    "unit_cost": 1800,
    "availability": true,
    "category": "Stage Equipment",
    "storage_location": "Logistics Warehouse, North Bay"
  },
  {
    "resource_id": "RES_MED_001",
    "resource_name": "First Aid Mobile Response Kit with AED and Oxygen Cylinder",
    "available_quantity": 4,
    "unit_cost": 400,
    "availability": true,
    "category": "Safety & Healthcare",
    "storage_location": "Campus Health Centre, Ground Floor"
  },
  {
    "resource_id": "RES_BAR_001",
    "resource_name": "Retractable Queue Crowd Control Stanchion Belts (Pair of 4)",
    "available_quantity": 25,
    "unit_cost": 300,
    "availability": true,
    "category": "Logistics & Security",
    "storage_location": "Campus Security Command Office, Gate 1"
  }
];

const DEFAULT_RULES = [
  {
    "rule_id": "RUL_TIME_001",
    "category": "Event Timing & Curfew",
    "title": "Campus Event Curfew and Quiet Hours",
    "description": "All indoor and outdoor college events must conclude by 20:00 hours (8:00 PM). Post-curfew extensions up to 22:00 hours require explicit written sanction from the Dean of Student Affairs at least 5 business days in advance.",
    "parameters": {
      "standard_curfew_time": "20:00",
      "max_extended_curfew_time": "22:00",
      "approval_lead_time_days": 5,
      "approving_authority": "Dean of Student Affairs"
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_TIME_001 Campus Event Curfew: All college events must conclude by 8:00 PM (20:00). Event extension up to 10:00 PM is permissible only with written approval from Dean of Student Affairs submitted 5 days in advance. No campus events are allowed past 22:00 under any circumstance."
  },
  {
    "rule_id": "RUL_VEN_001",
    "category": "Venue & Capacity Compliance",
    "title": "Maximum Venue Occupancy and Safety Clearances",
    "description": "Total expected attendees cannot exceed 100% of the specified venue capacity. A safety buffer of at least 10% must remain unallocated for emergency exits. Overcrowding is strictly prohibited under campus safety regulations.",
    "parameters": {
      "max_occupancy_percentage": 100,
      "safety_buffer_percentage": 10,
      "fire_exit_clearance_meters": 2.5
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_VEN_001 Venue Capacity: The number of registered attendees must not exceed the venue capacity. Auditorium max capacity is 850, Seminar Hall 250, Turing Lab 120, OAT 2000, Conference Room 50, Indoor Sports 600, Mech CAD Lab 80, Library Commons 100. Emergency exits must remain unobstructed."
  },
  {
    "rule_id": "RUL_RES_001",
    "category": "Resource Allocation & Booking Lead Time",
    "title": "Resource Requisition Advance Notice and Quotas",
    "description": "Audio-Visual and Stage equipment requisitions must be submitted at least 72 hours (3 working days) prior to the event start. High-cost items (unit cost > INR 2000) require faculty coordinator endorsement.",
    "parameters": {
      "min_booking_lead_time_hours": 72,
      "high_cost_threshold_inr": 2000,
      "max_projectors_per_event": 2,
      "max_pa_systems_per_event": 1
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_RES_001 Resource Requisition: Resources must be booked at least 72 hours (3 working days) before the event. Projectors are capped at 2 per event unless high-scale auditorium approval is given. Equipment unit cost above 2000 INR requires faculty coordinator signature."
  },
  {
    "rule_id": "RUL_SND_001",
    "category": "Acoustic & Noise Level Limits",
    "title": "Decibel Levels and Outdoor Sound Regulations",
    "description": "Outdoor sound systems and amplified music are permitted only between 16:30 and 19:30 hours. Sound levels must not exceed 75 dB near academic blocks, classrooms, and the central library.",
    "parameters": {
      "max_decibel_level_academic_zone": 75,
      "outdoor_sound_start_time": "16:30",
      "outdoor_sound_end_time": "19:30"
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_SND_001 Noise Regulations: Maximum noise level permitted is 75 dB near classrooms and library. Outdoor sound amplification at OAT or grounds is restricted to 4:30 PM to 7:30 PM to avoid disrupting academic sessions."
  },
  {
    "rule_id": "RUL_BUD_001",
    "category": "Financial & Budgeting Compliance",
    "title": "Budget Cap and Expense Settlement Protocol",
    "description": "The allocated budget for student club events cannot exceed INR 50,000 without Principal / Trustee pre-authorization. Itemized expenditure vouchers must be submitted to the accounts office within 7 working days of event completion.",
    "parameters": {
      "standard_club_budget_limit_inr": 50000,
      "voucher_settlement_window_days": 7,
      "refreshment_cap_per_head_inr": 120
    },
    "enforcement_level": "STRICT",
    "rag_text": "Rule RUL_BUD_001 Budget Compliance: Club event budgets are capped at 50,000 INR. Per-head refreshment allowance is capped at 120 INR. Expense bills must be settled with finance department within 7 working days."
  },
  {
    "rule_id": "RUL_ATT_001",
    "category": "Academic & Attendance Integrity",
    "title": "On-Duty (OD) Leave Eligibility for Student Volunteers",
    "description": "Student organizers and volunteers are eligible for On-Duty (OD) attendance credit only if they maintain a baseline 75% classroom attendance prior to the event. Maximum OD granted is 2 consecutive days per semester.",
    "parameters": {
      "min_academic_attendance_percentage": 75,
      "max_od_days_per_semester": 2,
      "approving_head": "Head of Department (HOD)"
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_ATT_001 On-Duty (OD) Leave: Students must have at least 75% attendance to receive OD for organizing college events. Maximum OD allowable is 2 days per semester with HOD signature."
  },
  {
    "rule_id": "RUL_SEC_001",
    "category": "Campus Security & Guest Protocol",
    "title": "External Guest Clearance and Identity Verification",
    "description": "All external guests, speakers, judges, and visiting participants must carry valid photo identification and obtain security visitor passes at Gate 1. Dignitaries and VIP chief guests require a 7-day prior intimation to campus security.",
    "parameters": {
      "vip_intimation_lead_time_days": 7,
      "mandatory_id_verification": true,
      "entry_gate": "Gate 1 (Main Entrance)"
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_SEC_001 Guest Protocol: External judges and guests require prior security clearance 7 days before the event. All participants and guests must present valid government or college photo ID at Gate 1."
  },
  {
    "rule_id": "RUL_GRN_001",
    "category": "Sustainability & Green Campus",
    "title": "Plastic-Free and Eco-Friendly Event Protocol",
    "description": "Single-use plastic bottles, non-biodegradable flex banners, and disposable plastic cutlery are strictly prohibited on campus. Event organizers must deploy segregated waste disposal bins for organic and dry recyclable waste.",
    "parameters": {
      "single_use_plastic_allowed": false,
      "waste_segregation_required": true,
      "penalty_non_compliance_inr": 2000
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_GRN_001 Green Protocol: Single-use plastics, plastic water bottles, and plastic cutlery are banned. Waste segregation into dry and organic bins is mandatory at all event venues."
  },
  {
    "rule_id": "RUL_STF_001",
    "category": "Faculty & Staff Governance",
    "title": "Mandatory Faculty Coordinator Supervision",
    "description": "Every college event must have at least one designated faculty coordinator present on-site throughout the event duration for emergency escalation, student welfare, and administrative oversight.",
    "parameters": {
      "min_faculty_coordinators_present": 1,
      "mandatory_on_site_presence": true
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_STF_001 Faculty Supervision: Every event requires at least one appointed faculty coordinator physically present on campus during the entire event duration."
  },
  {
    "rule_id": "RUL_VOL_001",
    "category": "Volunteer & Crowd Management",
    "title": "Student Volunteer Ratio and Crowd Management",
    "description": "Organizers must deploy a minimum ratio of 1 student volunteer for every 25 expected attendees to manage registrations, crowd flow, and logistics.",
    "parameters": {
      "attendees_per_volunteer_ratio": 25,
      "min_volunteers_floor": 2
    },
    "enforcement_level": "RECOMMENDED",
    "rag_text": "Rule RUL_VOL_001 Volunteer Ratio: Events require a minimum of 1 student volunteer per 25 expected attendees, with a minimum baseline of 2 volunteers."
  },
  {
    "rule_id": "RUL_FOD_001",
    "category": "Catering & Hospitality",
    "title": "Campus Catering Hygiene and Food Safety Compliance",
    "description": "All event refreshments, lunch packets, and snacks must be sourced exclusively from campus-empanelled FSSAI-certified food vendors. Distribution is restricted to authorized dining halls or designated refreshment zones.",
    "parameters": {
      "fssai_certification_required": true,
      "authorized_distribution_zones_only": true
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_FOD_001 Catering Compliance: Food and refreshments must be procured only from FSSAI-certified campus-approved vendors and served exclusively in designated dining/refreshment zones."
  },
  {
    "rule_id": "RUL_CLN_001",
    "category": "Post-Event Logistics & Handover",
    "title": "Post-Event Cleanliness, Inventory Audit, and Handover",
    "description": "Venues and rented resources must undergo a physical cleanliness check and return audit within 2 hours of event completion. Any damaged equipment or unattended waste will incur departmental logistics deductions.",
    "parameters": {
      "max_handover_window_hours": 2,
      "post_event_inspection_mandatory": true
    },
    "enforcement_level": "MANDATORY",
    "rag_text": "Rule RUL_CLN_001 Venue Handover: Venues and resources must be audited and returned in clean condition within 2 hours of event conclusion."
  }
];

const INITIAL_EVENTS = [
  {
    "event_id": "EVT001",
    "title": "AI HackMatrix 2026: 24-Hour Agentic Hackathon",
    "category": "Technical Symposium",
    "event_type": "Hackathon",
    "department": "Computer Science and Engineering",
    "description": "An intensive flagship hackathon focused on building autonomous agent workflows, generative AI models, and real-time intelligent agents.",
    "expected_attendees": 110,
    "start_date": "2026-09-15",
    "start_time": "09:00",
    "end_date": "2026-09-16",
    "end_time": "17:00",
    "date": "2026-09-15",
    "venue_id": "VEN_LAB_001",
    "venue_name": "Alan Turing High Performance Computing Lab",
    "budget_cap": 45000,
    "budget": 45000,
    "calculated_cost": 38200,
    "status": "COLLECTING_RESPONSES",
    "workflow_state": "COLLECTING_RESPONSES",
    "pending_requirements": [
      "STAFF_AVAILABILITY",
      "STUDENT_INTEREST"
    ],
    "identified_problems": [],
    "failure_reasons": [],
    "replan_count": 0,
    "last_agent_action": "PEOPLE_AGENT_CHECK_AVAILABILITY",
    "created_by": "ADM001",
    "created_at": "2026-08-21T09:30:00Z",
    "updated_at": "2026-08-21T09:30:00Z",
    "coordinators": [
      {
        "user_id": "STF001",
        "name": "Prof. Rajesh Raman",
        "registration_id": "STF001",
        "department": "Computer Science and Engineering",
        "role_type": "Lead Faculty Coordinator",
        "response": "APPROVED",
        "responded_at": "2026-08-21T10:15:00Z",
        "remarks": "Approved. Computing clusters and high-bandwidth network are reserved."
      },
      {
        "user_id": "STF004",
        "name": "Dr. Ananya Deshmukh",
        "registration_id": "STF004",
        "department": "Information Technology",
        "role_type": "Technical Evaluation Co-Lead",
        "response": "PENDING",
        "responded_at": null,
        "remarks": ""
      }
    ],
    "volunteers": [
      {
        "user_id": "STU001",
        "name": "Aarav Sharma",
        "registration_id": "STU001",
        "department": "Computer Science and Engineering",
        "task": "Lab Infrastructure & Cloud Keys Distribution",
        "od_eligible": true,
        "response": "APPROVED",
        "responded_at": "2026-08-21T10:30:00Z"
      },
      {
        "user_id": "STU002",
        "name": "Aditi Verma",
        "registration_id": "STU002",
        "department": "Artificial Intelligence & Data Science",
        "task": "Participant Check-In Desk & Welcome Kits",
        "od_eligible": true,
        "response": "PENDING",
        "responded_at": null
      },
      {
        "user_id": "STU003",
        "name": "Advait Gupta",
        "registration_id": "STU003",
        "department": "Electronics and Communication Engineering",
        "task": "Hardware Bench & Peripherals Support",
        "od_eligible": true,
        "response": "PENDING",
        "responded_at": null
      },
      {
        "user_id": "STU004",
        "name": "Akash Patel",
        "registration_id": "STU004",
        "department": "Information Technology",
        "task": "Stage & Speaker Hospitality Lead",
        "od_eligible": true,
        "response": "APPROVED",
        "responded_at": "2026-08-21T11:00:00Z"
      }
    ],
    "resources": [
      {
        "resource_id": "RES_PRJ_001",
        "resource_name": "High-Lumen 4K Laser Projector (Epson 7000 Lumens)",
        "quantity": 1,
        "unit_cost": 2000,
        "total_cost": 2000
      },
      {
        "resource_id": "RES_WIFI_001",
        "resource_name": "High-Density Portable Wi-Fi 6 Access Point Hub (Cisco)",
        "quantity": 3,
        "unit_cost": 1200,
        "total_cost": 3600
      },
      {
        "resource_id": "RES_PWR_001",
        "resource_name": "Heavy-Duty Surge Protected Multi-Plug Extension Hubs (30m)",
        "quantity": 12,
        "unit_cost": 150,
        "total_cost": 1800
      },
      {
        "resource_id": "RES_MIC_001",
        "resource_name": "Cordless UHF Collar & Handheld Microphone Set (Shure 4-Pack)",
        "quantity": 2,
        "unit_cost": 600,
        "total_cost": 1200
      },
      {
        "resource_id": "RES_MED_001",
        "resource_name": "First Aid Mobile Response Kit with AED and Oxygen Cylinder",
        "quantity": 1,
        "unit_cost": 400,
        "total_cost": 400
      }
    ],
    "schedule": [
      {
        "time": "09:00 - 10:00",
        "activity": "Participant Registration & Breakfast Networking",
        "venue": "Turing Lab Foyer"
      },
      {
        "time": "10:00 - 11:00",
        "activity": "Opening Keynote & Problem Statement Release",
        "venue": "Alan Turing Lab Stage"
      },
      {
        "time": "11:00 - 19:30",
        "activity": "Hacking Session 1: Architecture & Model Prototyping",
        "venue": "Alan Turing Lab Workstations"
      },
      {
        "time": "19:30 - 20:00",
        "activity": "Daily Checkpoint & Mentor Round 1",
        "venue": "Alan Turing Lab"
      },
      {
        "time": "09:00 - 14:00 (Day 2)",
        "activity": "Sprint 2: UI Polish & Live Agent Sandbox",
        "venue": "Alan Turing Lab"
      },
      {
        "time": "14:00 - 16:30 (Day 2)",
        "activity": "Jury Pitching & Live Demonstrations",
        "venue": "Alan Turing Lab Smart Display"
      },
      {
        "time": "16:30 - 17:00 (Day 2)",
        "activity": "Valedictory & Prize Distribution",
        "venue": "Alan Turing Lab Stage"
      }
    ],
    "compliance": {
      "score": 98,
      "status": "COMPLIANT",
      "checks": [
        {
          "rule": "RUL_VEN_001",
          "title": "Capacity Safety Check",
          "pass": true,
          "detail": "110 attendees within 120 lab capacity (91.6% occupancy, emergency exits clear)."
        },
        {
          "rule": "RUL_TIME_001",
          "title": "Curfew Check",
          "pass": true,
          "detail": "Concludes by 17:00 daily; adheres to standard 20:00 curfew."
        },
        {
          "rule": "RUL_BUD_001",
          "title": "Budget Adherence",
          "pass": true,
          "detail": "Total estimated expense INR 38,200 is within INR 45,000 cap."
        },
        {
          "rule": "RUL_VOL_001",
          "title": "Volunteer Deployment",
          "pass": true,
          "detail": "4 volunteers deployed for 110 attendees (1:27.5 ratio meets standard)."
        },
        {
          "rule": "RUL_GRN_001",
          "title": "Green Protocol",
          "pass": true,
          "detail": "Paperless QR registration, digital badging, zero single-use plastics."
        }
      ]
    },
    "ai_recommendations": [
      "Optimal venue chosen: Alan Turing Lab provides 120 GPU workstations suited for agent builds.",
      "Cisco Wi-Fi 6 hubs will prevent network congestion during large model weights downloads.",
      "Prof. Rajesh Raman has accepted coordinator duty. Awaiting Dr. Ananya Deshmukh's confirmation."
    ]
  }
];

const INITIAL_RESPONSES = [
  {
    "response_id": "RESP001",
    "event_id": "EVT001",
    "user_id": "STF001",
    "request_type": "STAFF_AVAILABILITY",
    "response": "YES",
    "status": "COMPLETED",
    "timestamp": "2026-08-21T10:15:00Z"
  },
  {
    "response_id": "RESP002",
    "event_id": "EVT001",
    "user_id": "STU001",
    "request_type": "STUDENT_INTEREST",
    "response": "YES",
    "status": "COMPLETED",
    "timestamp": "2026-08-21T10:30:00Z"
  },
  {
    "response_id": "RESP003",
    "event_id": "EVT001",
    "user_id": "STU004",
    "request_type": "STUDENT_INTEREST",
    "response": "YES",
    "status": "COMPLETED",
    "timestamp": "2026-08-21T11:00:00Z"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    "id": "NOTIF001",
    "recipient_id": "STF004",
    "title": "Faculty Coordinator Invitation",
    "message": "You have been requested by Admin to coordinate 'AI HackMatrix 2026' on Sept 15-16, 2026.",
    "type": "REQUEST",
    "event_id": "EVT001",
    "timestamp": "2026-08-21T09:35:00Z",
    "read": false,
    "action_required": true
  },
  {
    "id": "NOTIF002",
    "recipient_id": "STU002",
    "title": "Volunteer Duty Request",
    "message": "You are selected for 'Participant Check-In Desk' for AI HackMatrix 2026. On-Duty credit eligible.",
    "type": "REQUEST",
    "event_id": "EVT001",
    "timestamp": "2026-08-21T09:35:00Z",
    "read": false,
    "action_required": true
  },
  {
    "id": "NOTIF003",
    "recipient_id": "STU003",
    "title": "Volunteer Duty Request",
    "message": "You are assigned to 'Hardware Bench Support' for AI HackMatrix 2026. Please confirm attendance.",
    "type": "REQUEST",
    "event_id": "EVT001",
    "timestamp": "2026-08-21T09:35:00Z",
    "read": false,
    "action_required": true
  },
  {
    "id": "NOTIF004",
    "recipient_id": "ADM001",
    "title": "Faculty Approval Received",
    "message": "Prof. Rajesh Raman accepted the coordinator role for AI HackMatrix 2026.",
    "type": "INFO",
    "event_id": "EVT001",
    "timestamp": "2026-08-21T10:15:00Z",
    "read": true,
    "action_required": false
  }
];

/**
 * Storage Manager Helper
 */
class StorageManager {
  constructor() {
    this.prefix = "AI_EVENT_MGR_";
    this.init();
  }

  init() {
    // Force sync with latest UI dataset
    localStorage.setItem(this.prefix + "users", JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(this.prefix + "staff", JSON.stringify(DEFAULT_STAFF));
    localStorage.setItem(this.prefix + "students", JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem(this.prefix + "venues", JSON.stringify(DEFAULT_VENUES));
    localStorage.setItem(this.prefix + "resources", JSON.stringify(DEFAULT_RESOURCES));
    localStorage.setItem(this.prefix + "rules", JSON.stringify(DEFAULT_RULES));
    
    if (!localStorage.getItem(this.prefix + "events")) {
      localStorage.setItem(this.prefix + "events", JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem(this.prefix + "responses")) {
      localStorage.setItem(this.prefix + "responses", JSON.stringify(INITIAL_RESPONSES));
    }
    if (!localStorage.getItem(this.prefix + "notifications")) {
      localStorage.setItem(this.prefix + "notifications", JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(this.prefix + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return null;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  resetAll() {
    localStorage.removeItem(this.prefix + "users");
    localStorage.removeItem(this.prefix + "staff");
    localStorage.removeItem(this.prefix + "students");
    localStorage.removeItem(this.prefix + "venues");
    localStorage.removeItem(this.prefix + "resources");
    localStorage.removeItem(this.prefix + "rules");
    localStorage.removeItem(this.prefix + "events");
    localStorage.removeItem(this.prefix + "responses");
    localStorage.removeItem(this.prefix + "notifications");
    localStorage.removeItem(this.prefix + "current_user");
    this.init();
  }
}

const AppStorage = new StorageManager();
