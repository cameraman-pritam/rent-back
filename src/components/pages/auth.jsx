import React from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import Root from "../structure/root";
import { FloatLabel } from "primereact/floatlabel";
import { auth } from "../../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier, // 1. Import RecaptchaVerifier here
} from "firebase/auth";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth";

export default function Auth() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // 2. Initialise reCAPTCHA safely when the component loads
  React.useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container"
      );
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully:", response.user);
        Swal.fire({ title: "Success!", text: "Logged in successfully!" });
      } else {
        if (email) {
          response = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          console.log("User created successfully:", response.user);
          alert(
            "Account created successfully! Please check your email to verify your account."
          );
          setIsLogin(true);
        } else {
          // 3. Use the initialised appVerifier here
          const appVerifier = window.recaptchaVerifier;
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            number,
            appVerifier
          );
          window.confirmationResult = confirmationResult;

          alert("SMS sent! (Note: We need an OTP input to finish this!)");
          // Notice we don't say "account created" yet, because they still need to enter the OTP!
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      alert(error.message || "An error occurred during authentication.");
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
                />
              </FloatLabel>
            </div>

            {!isLogin && (
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
                  />
                </FloatLabel>
              </div>
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

            {/* 4. The container for the reCAPTCHA to attach itself to */}
            <div id="recaptcha-container"></div>

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
      </div>
    </>
  );
}
