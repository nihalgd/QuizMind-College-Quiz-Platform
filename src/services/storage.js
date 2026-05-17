export const STORAGE_KEYS = {
  currentUser: "quizmind_current_user",
  teachers: "quizmind_teachers",
  students: "quizmind_students",
  subjects: "quizmind_subjects",
  quizzes: "quizmind_quizzes",
  attempts: "quizmind_attempts",
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export const readStorage = (key, fallback) => {
  if (typeof window === "undefined") return clone(fallback);

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : clone(fallback);
  } catch {
    return clone(fallback);
  }
};

export const writeStorage = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};
