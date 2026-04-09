import React from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import Root from "../structure/root";
import { FloatLabel } from "primereact/floatlabel";
import { auth, db } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

// Import your new custom hook (adjust the path if you placed the context folder elsewhere)
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  // Grab the global user and userData from your Context!
  const { user, userData } = useAuth();

  const [isLogin, setIsLogin] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  // Form States
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [address, setAddress] = React.useState("");

  const handleLogout = async () => {
    await signOut(auth);
    Swal.fire("Logged Out", "See you again!", "success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        Swal.fire({ title: "Success!", text: "Logged in successfully!" });
      } else {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Save the extra details to Firestore during sign-up
        await setDoc(doc(db, "users", response.user.uid), {
          name,
          email,
          number,
          address,
          createdAt: new Date().toISOString(),
        });
        Swal.fire({
          title: "Account Created!",
          text: "Profile saved successfully.",
          icon: "success",
        });
        setIsLogin(true);
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const cardTitle = (
    <div className="text-center">
      <h3 className="font-bold text-2xl text-gray-800">
        {isLogin ? "Welcome Back" : "Create an Account"}
      </h3>
      <p className="mt-1 text-sm font-normal text-gray-500">
        {isLogin
          ? "Please enter your details to sign in."
          : "Sign up to get started."}
      </p>
      <Divider />
    </div>
  );

  const cardFooter = (
    <>
      <Divider align="center" className="my-4">
        <span className="text-sm text-gray-400">OR</span>
      </Divider>
      <div className="text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline hover:animate-pulse transition-all"
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <Root />
      <div className="flex min-h-screen items-center justify-center p-4">
        {user ? (
          /* --- LOGGED IN VIEW --- */
          <Card
            title="User Data"
            className="w-full max-w-md shadow-lg rounded-xl text-center"
          >
            <div className="flex flex-col gap-4">
              <p className="text-white">
                Logged in as: <strong>{user.email}</strong>
              </p>

              {/* DISPLAY FIRESTORE DATA HERE */}
              {userData ? (
                <>
                  <p className="text-white">
                    Name: <strong>{userData.name}</strong>
                  </p>
                  <p className="text-white">
                    Mobile Number: <strong>{userData.number}</strong>
                  </p>
                  <p className="text-white">
                    Address: <strong>{userData.address}</strong>
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Loading profile data...</p>
              )}

              <Button
                label="Logout"
                onClick={handleLogout}
                className="w-full rounded-md bg-red-500 p-3 font-semibold text-white hover:bg-red-600 transition-colors"
              />
            </div>
          </Card>
        ) : (
          /* --- ORIGINAL LOGIN/SIGNUP DESIGN --- */
          <Card
            title={cardTitle}
            footer={cardFooter}
            className="w-full max-w-md shadow-lg rounded-xl"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex flex-col gap-2">
                  <FloatLabel>
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <InputText
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required={!isLogin}
                    />
                  </FloatLabel>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <FloatLabel>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <InputText
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </FloatLabel>
              </div>

              {!isLogin && (
                <>
                  <div className="flex flex-col gap-2">
                    <FloatLabel>
                      <label
                        htmlFor="number"
                        className="text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <InputText
                        id="number"
                        type="tel"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="+91 99999 99999"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required={!isLogin}
                      />
                    </FloatLabel>
                  </div>

                  <div className="flex flex-col gap-2">
                    <FloatLabel>
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-gray-700"
                      >
                        Full Address
                      </label>
                      <InputText
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Your street address"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required={!isLogin}
                      />
                    </FloatLabel>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-2">
                <FloatLabel>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    feedback={!isLogin}
                    inputClassName="w-full p-2 border border-gray-300 rounded-md"
                    className="w-full"
                    required
                  />
                </FloatLabel>
              </div>

              <Button
                label={
                  loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"
                }
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 transition-colors"
              />
            </form>
          </Card>
        )}
      </div>
    </>
  );
}
