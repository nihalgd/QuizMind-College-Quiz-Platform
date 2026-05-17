import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ADMIN_USER, DEFAULT_STUDENTS, DEFAULT_TEACHERS } from "../data/seedData";
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from "../services/storage";

const AuthContext = createContext(null);

const safeUser = (user) => {
  if (!user) return null;
  const { password, ...publicUser } = user;
  return publicUser;
};

const getLoginUsers = () => {
  const teachers = readStorage(STORAGE_KEYS.teachers, DEFAULT_TEACHERS);
  const students = readStorage(STORAGE_KEYS.students, DEFAULT_STUDENTS);
  return [ADMIN_USER, ...teachers, ...students];
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => readStorage(STORAGE_KEYS.currentUser, null));

  const login = useCallback((identifier, password) => {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const users = getLoginUsers();
    const user = users.find((candidate) => {
      const emailMatch = candidate.email?.toLowerCase() === normalizedIdentifier;
      const rollMatch = candidate.rollNo?.toLowerCase() === normalizedIdentifier;
      return (emailMatch || rollMatch) && candidate.password === password;
    });

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const publicUser = safeUser(user);
    setCurrentUser(publicUser);
    writeStorage(STORAGE_KEYS.currentUser, publicUser);
    return { success: true, user: publicUser };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    removeStorage(STORAGE_KEYS.currentUser);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      login,
      logout,
    }),
    [currentUser, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
