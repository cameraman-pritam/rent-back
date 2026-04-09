/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
// Adjust this path based on where you save AuthContext.jsx relative to your firebase.js
import { auth, db } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // Prevents layout flicker

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // If they are logged in, fetch their extra details from Firestore
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        // Clear data if logged out
        setUserData(null);
      }

      // Stop the loading state once Firebase has figured out who the user is
      setLoadingAuth(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loadingAuth }}>
      {/* Wait until initial auth check finishes before rendering the app */}
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
}

// 3. Create and export the custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
