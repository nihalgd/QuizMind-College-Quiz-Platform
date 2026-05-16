export const DUMMY_USERS = [
  { id: 1, name: "Nihal Goud", email: "student@skitm.in", password: "password", role: "student", rollNo: "CS2023045", department: "Computer Science", semester: "5th", avatar: "NG" },
  { id: 2, name: "Prof. Khushboo Nagar", email: "teacher@skitm.in", password: "password", role: "teacher", department: "Computer Science", avatar: "KN" },
  { id: 3, name: "Dr. Mamta Punjabi", email: "rakesh@college.edu", password: "password", role: "teacher", department: "Computer Science", avatar: "MB" },
  { id: 4, name: "Dr. Ratnalata Gupta", email: "anita@college.edu", password: "password", role: "teacher", department: "Information Technology", avatar: "RG" },
  { id: 5, name: "Admin User", email: "admin@skitm.in", password: "password", role: "admin", avatar: "AD" }
];

export const DUMMY_SUBJECTS = [
  { id: 1, name: "Data Structures & Algorithms", code: "CS501", teacherId: 2, teacherName: "Prof. Khushboo Nagar", department: "Computer Science", semester: "5th" },
  { id: 2, name: "Database Management Systems", code: "CS502", teacherId: 3, teacherName: "Dr. Mamta Punjabi", department: "Computer Science", semester: "5th" },
  { id: 3, name: "Operating Systems", code: "CS503", teacherId: 4, teacherName: "Dr. Ratnalata Gupta", department: "Information Technology", semester: "5th" },
  { id: 4, name: "Computer Networks", code: "CS504", teacherId: 2, teacherName: "Prof. Khushboo Nagar", department: "Computer Science", semester: "5th" },
  { id: 5, name: "Software Engineering", code: "CS505", teacherId: 3, teacherName: "Dr. Mamta Punjabi", department: "Computer Science", semester: "5th" },
  { id: 6, name: "Artificial Intelligence", code: "CS506", teacherId: 2, teacherName: "Prof. Khushboo Nagar", department: "Computer Science", semester: "6th" }
];

export const DUMMY_UNITS = {
  1: [
    { id: 101, name: "Unit 1: Arrays & Linked Lists", quizAvailable: true, attemptStatus: "attempted" },
    { id: 102, name: "Unit 2: Stacks & Queues", quizAvailable: true, attemptStatus: "not_attempted" },
    { id: 103, name: "Unit 3: Trees & Graphs", quizAvailable: false, attemptStatus: "locked" },
    { id: 104, name: "Unit 4: Sorting Algorithms", quizAvailable: true, attemptStatus: "not_attempted" },
    { id: 105, name: "Unit 5: Searching & Hashing", quizAvailable: false, attemptStatus: "locked" }
  ],
  2: [
    { id: 201, name: "Unit 1: ER Model & Relational Model", quizAvailable: true, attemptStatus: "attempted" },
    { id: 202, name: "Unit 2: SQL & Normalization", quizAvailable: true, attemptStatus: "attempted" },
    { id: 203, name: "Unit 3: Transaction Management", quizAvailable: true, attemptStatus: "not_attempted" },
    { id: 204, name: "Unit 4: Concurrency Control", quizAvailable: false, attemptStatus: "locked" }
  ],
  3: [
    { id: 301, name: "Unit 1: Process Management", quizAvailable: true, attemptStatus: "not_attempted" },
    { id: 302, name: "Unit 2: Memory Management", quizAvailable: false, attemptStatus: "locked" },
    { id: 303, name: "Unit 3: File Systems", quizAvailable: false, attemptStatus: "locked" }
  ],
  4: [
    { id: 401, name: "Unit 1: OSI & TCP/IP Models", quizAvailable: true, attemptStatus: "not_attempted" },
    { id: 402, name: "Unit 2: Data Link Layer", quizAvailable: false, attemptStatus: "locked" }
  ]
};

export const DUMMY_QUIZZES = [
  { id: 1, title: "Arrays & Linked Lists Quiz", subjectId: 1, unitId: 101, subjectName: "Data Structures & Algorithms", unitName: "Unit 1: Arrays & Linked Lists", difficulty: "Medium", questionCount: 10, status: "published", createdAt: "2024-01-15" },
  { id: 2, title: "Stacks & Queues Quiz", subjectId: 1, unitId: 102, subjectName: "Data Structures & Algorithms", unitName: "Unit 2: Stacks & Queues", difficulty: "Easy", questionCount: 8, status: "draft", createdAt: "2024-01-20" },
  { id: 3, title: "ER Model Quiz", subjectId: 2, unitId: 201, subjectName: "Database Management Systems", unitName: "Unit 1: ER Model & Relational Model", difficulty: "Medium", questionCount: 10, status: "published", createdAt: "2024-01-10" },
  { id: 4, title: "SQL & Normalization Quiz", subjectId: 2, unitId: 202, subjectName: "Database Management Systems", unitName: "Unit 2: SQL & Normalization", difficulty: "Hard", questionCount: 12, status: "published", createdAt: "2024-01-18" },
  { id: 5, title: "Sorting Algorithms Quiz", subjectId: 1, unitId: 104, subjectName: "Data Structures & Algorithms", unitName: "Unit 4: Sorting Algorithms", difficulty: "Medium", questionCount: 10, status: "draft", createdAt: "2024-01-22" },
  { id: 6, title: "OSI Model Quiz", subjectId: 4, unitId: 401, subjectName: "Computer Networks", unitName: "Unit 1: OSI & TCP/IP Models", difficulty: "Easy", questionCount: 8, status: "published", createdAt: "2024-01-12" }
];

export const DUMMY_QUESTIONS = [
  { id: 1, quizId: 1, text: "What is the time complexity of accessing an element in an array by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0 },
  { id: 2, quizId: 1, text: "Which data structure uses FIFO principle?", options: ["Stack", "Queue", "Array", "Tree"], correctAnswer: 1 },
  { id: 3, quizId: 1, text: "What is the worst-case time complexity of searching in a singly linked list?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctAnswer: 2 },
  { id: 4, quizId: 1, text: "In a doubly linked list, each node contains how many pointers?", options: ["One", "Two", "Three", "Four"], correctAnswer: 1 },
  { id: 5, quizId: 1, text: "Which of the following is a dynamic data structure?", options: ["Array", "Linked List", "Both", "Neither"], correctAnswer: 1 },
  { id: 6, quizId: 1, text: "What is the space complexity of a singly linked list with n nodes?", options: ["O(1)", "O(n)", "O(n²)", "O(log n)"], correctAnswer: 1 },
  { id: 7, quizId: 1, text: "Which operation is most efficient in an array compared to a linked list?", options: ["Insertion at beginning", "Deletion at beginning", "Random access", "Insertion at end"], correctAnswer: 2 },
  { id: 8, quizId: 1, text: "A circular linked list has the last node pointing to?", options: ["Null", "First node", "Last node", "Middle node"], correctAnswer: 1 },
  { id: 9, quizId: 1, text: "Which of the following cannot be implemented efficiently with arrays?", options: ["Stack", "Queue", "Priority Queue", "All can be implemented efficiently"], correctAnswer: 2 },
  { id: 10, quizId: 1, text: "The header node in a linked list is used to?", options: ["Store data", "Mark the end", "Store metadata about the list", "None of the above"], correctAnswer: 2 }
];

export const DUMMY_RECENT_ATTEMPTS = [
  { id: 1, subjectName: "Data Structures & Algorithms", unitName: "Unit 1: Arrays & Linked Lists", score: 8, totalQuestions: 10, percentage: 80, date: "2024-01-16" },
  { id: 2, subjectName: "Database Management Systems", unitName: "Unit 1: ER Model & Relational Model", score: 7, totalQuestions: 10, percentage: 70, date: "2024-01-12" },
  { id: 3, subjectName: "Database Management Systems", unitName: "Unit 2: SQL & Normalization", score: 10, totalQuestions: 12, percentage: 83, date: "2024-01-19" }
];

export const DUMMY_TEACHERS = [
  { id: 2, name: "Prof. Khushboo Nagar", email: "teacher@skitm.in", department: "Computer Science" },
  { id: 3, name: "Dr. Mamta Punjabi", email: "teacher@skitm.in", department: "Computer Science" },
  { id: 4, name: "Dr. Ratnalata Gupta", email: "teacher@skitm.in", department: "Information Technology" },
  { id: 6, name: "Dr. Lakhan Yadav", email: "teacher@skitm.in", department: "Electronics" },
  { id: 7, name: "Dr. Neha Gupta", email: "teacher@skitm.in", department: "Mechanical Engineering" }
];

export const DUMMY_ASSIGNMENTS = [
  { teacherId: 2, teacherName: "Prof. Khushboo Nagar", subjects: [1, 4, 6] },
  { teacherId: 3, teacherName: "Dr. Mamta Punjabi", subjects: [2, 5] },
  { teacherId: 4, teacherName: "Dr. Ratnalata Gupta", subjects: [3] }
];
