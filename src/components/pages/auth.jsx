import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Card } from "primereact/card";
import Root from "../structure/root";
import { supabase } from "../../utils/supabase"; // <-- Updated import

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        console.log("Logged in successfully:", data.user);
        alert("Logged in successfully!");

        // TODO: Redirect user or update global auth state here
      } else {
        // --- SIGNUP LOGIC ---
        const nameParts = name.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        if (error) throw error;

        console.log("User created successfully:", data.user);
        // Note: Depending on your Supabase settings, they might need to verify their email
        alert("Account created successfully! You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Auth Error:", error);
      // Supabase returns nice error messages we can display directly
      alert(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  // Structured to match the `About` component's title prop pattern
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

  // Extracting the toggle into a footer for cleaner Card structure
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
              </div>
            )}

            <div className="flex flex-col gap-2">
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
            </div>

            <div className="flex flex-col gap-2">
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
                toggleMask
                feedback={!isLogin}
                inputClassName="w-full p-2 border border-gray-300 rounded-md"
                className="w-full"
                required
              />
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
      </div>
    </>
  );
}
