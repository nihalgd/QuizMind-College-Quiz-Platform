export const isValidEmail = (email = "") => /\S+@\S+\.\S+/.test(email.trim());

export const validateTeacher = (teacher) => {
  const errors = {};
  if (!teacher.name?.trim()) errors.name = "Teacher name is required";
  if (!isValidEmail(teacher.email)) errors.email = "Enter a valid email";
  if (!teacher.department?.trim()) errors.department = "Department is required";
  return errors;
};

export const validateStudent = (student) => {
  const errors = {};
  if (!student.name?.trim()) errors.name = "Student name is required";
  if (!isValidEmail(student.email)) errors.email = "Enter a valid email";
  if (!student.rollNo?.trim()) errors.rollNo = "Roll number is required";
  if (!student.department?.trim()) errors.department = "Department is required";
  if (!student.semester?.trim()) errors.semester = "Semester is required";
  return errors;
};

export const validateSubject = (subject) => {
  const errors = {};
  if (!subject.subjectName?.trim()) errors.subjectName = "Subject name is required";
  if (!subject.subjectCode?.trim()) errors.subjectCode = "Subject code is required";
  if (!subject.semester?.trim()) errors.semester = "Semester is required";
  return errors;
};
