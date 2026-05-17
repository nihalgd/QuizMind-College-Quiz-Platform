import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  DEFAULT_ATTEMPTS,
  DEFAULT_QUIZZES,
  DEFAULT_STUDENTS,
  DEFAULT_SUBJECTS,
  DEFAULT_TEACHERS,
} from "../data/seedData";
import { readStorage, STORAGE_KEYS, writeStorage } from "../services/storage";
import { createId } from "../utils/id";
import { getInitials } from "../utils/formatters";

const QuizContext = createContext(null);

const syncTeachersWithSubjects = (teachers, subjects) =>
  teachers.map((teacher) => ({
    ...teacher,
    role: "teacher",
    avatar: teacher.avatar || getInitials(teacher.name),
    assignedSubjects: subjects
      .filter((subject) => Number(subject.assignedTeacherId) === Number(teacher.id))
      .map((subject) => subject.id),
  }));

const normalizeStudent = (student) => ({
  ...student,
  role: "student",
  avatar: student.avatar || getInitials(student.name),
  password: student.password || "password",
});

const today = () => new Date().toISOString().slice(0, 10);

export const QuizProvider = ({ children }) => {
  const [subjects, setSubjects] = useState(() => readStorage(STORAGE_KEYS.subjects, DEFAULT_SUBJECTS));
  const [teachers, setTeachers] = useState(() =>
    syncTeachersWithSubjects(readStorage(STORAGE_KEYS.teachers, DEFAULT_TEACHERS), readStorage(STORAGE_KEYS.subjects, DEFAULT_SUBJECTS)),
  );
  const [students, setStudents] = useState(() => readStorage(STORAGE_KEYS.students, DEFAULT_STUDENTS).map(normalizeStudent));
  const [quizzes, setQuizzes] = useState(() => readStorage(STORAGE_KEYS.quizzes, DEFAULT_QUIZZES));
  const [attempts, setAttempts] = useState(() => readStorage(STORAGE_KEYS.attempts, DEFAULT_ATTEMPTS));

  const persistSubjectsAndTeachers = useCallback((nextSubjects, nextTeachers = teachers) => {
    const syncedTeachers = syncTeachersWithSubjects(nextTeachers, nextSubjects);
    setSubjects(nextSubjects);
    setTeachers(syncedTeachers);
    writeStorage(STORAGE_KEYS.subjects, nextSubjects);
    writeStorage(STORAGE_KEYS.teachers, syncedTeachers);
  }, [teachers]);

  const persistStudents = useCallback((nextStudents) => {
    const normalized = nextStudents.map(normalizeStudent);
    setStudents(normalized);
    writeStorage(STORAGE_KEYS.students, normalized);
  }, []);

  const persistQuizzes = useCallback((nextQuizzes) => {
    setQuizzes(nextQuizzes);
    writeStorage(STORAGE_KEYS.quizzes, nextQuizzes);
  }, []);

  const persistAttempts = useCallback((nextAttempts) => {
    setAttempts(nextAttempts);
    writeStorage(STORAGE_KEYS.attempts, nextAttempts);
  }, []);

  const addTeacher = useCallback((payload) => {
    const emailExists = teachers.some((teacher) => teacher.email.toLowerCase() === payload.email.trim().toLowerCase());
    const studentEmailExists = students.some((student) => student.email.toLowerCase() === payload.email.trim().toLowerCase());
    if (emailExists || studentEmailExists) {
      return { success: false, message: "Email is already in use" };
    }

    const teacher = {
      id: createId(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      department: payload.department,
      assignedSubjects: [],
      password: payload.password || "password",
      role: "teacher",
      avatar: getInitials(payload.name),
    };

    const nextTeachers = [...teachers, teacher];
    persistSubjectsAndTeachers(subjects, nextTeachers);
    return { success: true, teacher };
  }, [persistSubjectsAndTeachers, students, subjects, teachers]);

  const updateTeacher = useCallback((teacherId, payload) => {
    const emailExists = teachers.some(
      (teacher) => Number(teacher.id) !== Number(teacherId) && teacher.email.toLowerCase() === payload.email.trim().toLowerCase(),
    );
    if (emailExists) {
      return { success: false, message: "Email is already assigned to another teacher" };
    }

    const nextTeachers = teachers.map((teacher) =>
      Number(teacher.id) === Number(teacherId)
        ? {
            ...teacher,
            name: payload.name.trim(),
            email: payload.email.trim(),
            department: payload.department,
            avatar: getInitials(payload.name),
          }
        : teacher,
    );
    persistSubjectsAndTeachers(subjects, nextTeachers);
    return { success: true };
  }, [persistSubjectsAndTeachers, subjects, teachers]);

  const deleteTeacher = useCallback((teacherId) => {
    const nextSubjects = subjects.map((subject) =>
      Number(subject.assignedTeacherId) === Number(teacherId) ? { ...subject, assignedTeacherId: null } : subject,
    );
    const removedQuizIds = quizzes.filter((quiz) => Number(quiz.teacherId) === Number(teacherId)).map((quiz) => quiz.id);
    const nextTeachers = teachers.filter((teacher) => Number(teacher.id) !== Number(teacherId));
    const nextQuizzes = quizzes.filter((quiz) => Number(quiz.teacherId) !== Number(teacherId));
    persistSubjectsAndTeachers(nextSubjects, nextTeachers);
    persistQuizzes(nextQuizzes);
    persistAttempts(attempts.filter((attempt) => !removedQuizIds.includes(attempt.quizId)));
  }, [attempts, persistAttempts, persistQuizzes, persistSubjectsAndTeachers, quizzes, subjects, teachers]);

  const addStudent = useCallback((payload) => {
    const emailExists = [...students, ...teachers].some((user) => user.email.toLowerCase() === payload.email.trim().toLowerCase());
    const rollExists = students.some((student) => student.rollNo.toLowerCase() === payload.rollNo.trim().toLowerCase());
    if (emailExists) return { success: false, message: "Email is already in use" };
    if (rollExists) return { success: false, message: "Roll number is already in use" };

    const student = normalizeStudent({
      id: createId(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      rollNo: payload.rollNo.trim(),
      department: payload.department,
      semester: payload.semester,
      password: payload.password || "password",
    });

    persistStudents([...students, student]);
    return { success: true, student };
  }, [persistStudents, students, teachers]);

  const updateStudent = useCallback((studentId, payload) => {
    const emailExists = students.some(
      (student) => Number(student.id) !== Number(studentId) && student.email.toLowerCase() === payload.email.trim().toLowerCase(),
    );
    const rollExists = students.some(
      (student) => Number(student.id) !== Number(studentId) && student.rollNo.toLowerCase() === payload.rollNo.trim().toLowerCase(),
    );
    if (emailExists) return { success: false, message: "Email is already assigned to another student" };
    if (rollExists) return { success: false, message: "Roll number is already assigned to another student" };

    const nextStudents = students.map((student) =>
      Number(student.id) === Number(studentId)
        ? normalizeStudent({
            ...student,
            name: payload.name.trim(),
            email: payload.email.trim(),
            rollNo: payload.rollNo.trim(),
            department: payload.department,
            semester: payload.semester,
            avatar: getInitials(payload.name),
          })
        : student,
    );
    persistStudents(nextStudents);
    return { success: true };
  }, [persistStudents, students]);

  const deleteStudent = useCallback((studentId) => {
    persistStudents(students.filter((student) => Number(student.id) !== Number(studentId)));
    persistAttempts(attempts.filter((attempt) => Number(attempt.studentId) !== Number(studentId)));
  }, [attempts, persistAttempts, persistStudents, students]);

  const addSubject = useCallback((payload) => {
    const codeExists = subjects.some((subject) => subject.subjectCode.toLowerCase() === payload.subjectCode.trim().toLowerCase());
    if (codeExists) return { success: false, message: "Subject code is already in use" };

    const subject = {
      id: createId(),
      subjectName: payload.subjectName.trim(),
      subjectCode: payload.subjectCode.trim().toUpperCase(),
      semester: payload.semester,
      assignedTeacherId: payload.assignedTeacherId ? Number(payload.assignedTeacherId) : null,
    };

    persistSubjectsAndTeachers([...subjects, subject]);
    return { success: true, subject };
  }, [persistSubjectsAndTeachers, subjects]);

  const updateSubject = useCallback((subjectId, payload) => {
    const codeExists = subjects.some(
      (subject) => Number(subject.id) !== Number(subjectId) && subject.subjectCode.toLowerCase() === payload.subjectCode.trim().toLowerCase(),
    );
    if (codeExists) return { success: false, message: "Subject code is already assigned to another subject" };

    const nextSubjects = subjects.map((subject) =>
      Number(subject.id) === Number(subjectId)
        ? {
            ...subject,
            subjectName: payload.subjectName.trim(),
            subjectCode: payload.subjectCode.trim().toUpperCase(),
            semester: payload.semester,
            assignedTeacherId: payload.assignedTeacherId ? Number(payload.assignedTeacherId) : null,
          }
        : subject,
    );
    persistSubjectsAndTeachers(nextSubjects);
    return { success: true };
  }, [persistSubjectsAndTeachers, subjects]);

  const deleteSubject = useCallback((subjectId) => {
    const removedQuizIds = quizzes.filter((quiz) => Number(quiz.subjectId) === Number(subjectId)).map((quiz) => quiz.id);
    const nextSubjects = subjects.filter((subject) => Number(subject.id) !== Number(subjectId));
    const nextQuizzes = quizzes.filter((quiz) => Number(quiz.subjectId) !== Number(subjectId));
    persistSubjectsAndTeachers(nextSubjects);
    persistQuizzes(nextQuizzes);
    persistAttempts(attempts.filter((attempt) => !removedQuizIds.includes(attempt.quizId)));
  }, [attempts, persistAttempts, persistQuizzes, persistSubjectsAndTeachers, quizzes, subjects]);

  const assignSubjectsToTeacher = useCallback((teacherId, subjectIds) => {
    const normalizedIds = subjectIds.map(Number);
    const nextSubjects = subjects.map((subject) => {
      if (normalizedIds.includes(Number(subject.id))) {
        return { ...subject, assignedTeacherId: Number(teacherId) };
      }
      if (Number(subject.assignedTeacherId) === Number(teacherId)) {
        return { ...subject, assignedTeacherId: null };
      }
      return subject;
    });
    persistSubjectsAndTeachers(nextSubjects);
    return { success: true };
  }, [persistSubjectsAndTeachers, subjects]);

  const unassignSubject = useCallback((subjectId) => {
    const nextSubjects = subjects.map((subject) =>
      Number(subject.id) === Number(subjectId) ? { ...subject, assignedTeacherId: null } : subject,
    );
    persistSubjectsAndTeachers(nextSubjects);
  }, [persistSubjectsAndTeachers, subjects]);

  const addQuiz = useCallback((payload) => {
    const quiz = {
      id: createId(),
      title: payload.title.trim(),
      subjectId: Number(payload.subjectId),
      teacherId: Number(payload.teacherId),
      difficulty: payload.difficulty,
      questions: payload.questions,
      createdAt: today(),
      published: Boolean(payload.published),
    };

    persistQuizzes([quiz, ...quizzes]);
    return { success: true, quiz };
  }, [persistQuizzes, quizzes]);

  const updateQuiz = useCallback((quizId, payload) => {
    const nextQuizzes = quizzes.map((quiz) =>
      Number(quiz.id) === Number(quizId)
        ? {
            ...quiz,
            ...payload,
            subjectId: Number(payload.subjectId ?? quiz.subjectId),
            teacherId: Number(payload.teacherId ?? quiz.teacherId),
            title: payload.title?.trim() ?? quiz.title,
            questions: payload.questions ?? quiz.questions,
          }
        : quiz,
    );
    persistQuizzes(nextQuizzes);
    return { success: true };
  }, [persistQuizzes, quizzes]);

  const deleteQuiz = useCallback((quizId) => {
    persistQuizzes(quizzes.filter((quiz) => Number(quiz.id) !== Number(quizId)));
    persistAttempts(attempts.filter((attempt) => Number(attempt.quizId) !== Number(quizId)));
  }, [attempts, persistAttempts, persistQuizzes, quizzes]);

  const publishQuiz = useCallback((quizId, published = true) => {
    return updateQuiz(quizId, { published });
  }, [updateQuiz]);

  const submitQuizAttempt = useCallback((quizId, studentId, answers) => {
    const quiz = quizzes.find((candidate) => Number(candidate.id) === Number(quizId));
    if (!quiz || !quiz.published) {
      return { success: false, message: "Quiz is not available" };
    }

    const score = quiz.questions.reduce((total, question, index) => {
      return Number(answers[index]) === Number(question.correctAnswer) ? total + 1 : total;
    }, 0);

    const attempt = {
      id: createId(),
      quizId: Number(quizId),
      studentId: Number(studentId),
      answers,
      score,
      totalQuestions: quiz.questions.length,
      percentage: quiz.questions.length ? Math.round((score / quiz.questions.length) * 100) : 0,
      submittedAt: new Date().toISOString(),
    };

    persistAttempts([attempt, ...attempts]);
    return { success: true, attempt };
  }, [attempts, persistAttempts, quizzes]);

  const assignments = useMemo(
    () =>
      teachers.map((teacher) => ({
        teacherId: teacher.id,
        teacherName: teacher.name,
        subjects: subjects.filter((subject) => Number(subject.assignedTeacherId) === Number(teacher.id)).map((subject) => subject.id),
      })),
    [subjects, teachers],
  );

  const value = useMemo(
    () => ({
      teachers,
      students,
      subjects,
      quizzes,
      attempts,
      assignments,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addStudent,
      updateStudent,
      deleteStudent,
      addSubject,
      updateSubject,
      deleteSubject,
      assignSubjectsToTeacher,
      unassignSubject,
      addQuiz,
      updateQuiz,
      deleteQuiz,
      publishQuiz,
      submitQuizAttempt,
    }),
    [
      addQuiz,
      addStudent,
      addSubject,
      addTeacher,
      assignSubjectsToTeacher,
      assignments,
      attempts,
      deleteQuiz,
      deleteStudent,
      deleteSubject,
      deleteTeacher,
      publishQuiz,
      quizzes,
      students,
      subjects,
      submitQuizAttempt,
      teachers,
      unassignSubject,
      updateQuiz,
      updateStudent,
      updateSubject,
      updateTeacher,
    ],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
