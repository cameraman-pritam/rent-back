import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../utils/supabase";

const SignIn = () => {
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  if (user) {
    return (
      <div className="text-white text-center mt-20">
        You are already signed in.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center overflow-hidden font-body">
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#080e1b_100%)] opacity-80" />
      </div>

      <main className="relative z-10 w-full max-w-120 px-6 py-12 flex flex-col items-center">
        <header className="text-center mb-10 space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Rent Back
          </h1>
          <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase">
            Own less. Live more.
          </p>
        </header>

        <section className="w-full backdrop-blur-xl bg-surface-container/40 rounded-2xl p-1 border border-outline-variant/15 shadow-xl">
          <div className="bg-surface-container/60 rounded-2xl p-8 md:p-12 space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl font-semibold text-on-surface">
                Welcome back
              </h2>
              <p className="text-on-surface-variant text-sm">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="flex items-center bg-surface-container-high/50 rounded-xl px-3">
                <AlternateEmailIcon className="text-on-surface-variant/50 mr-2" />
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="name@company.com"
                  InputProps={{ disableUnderline: true }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center bg-surface-container-high/50 rounded-xl px-3">
                <LockIcon className="text-on-surface-variant/50 mr-2" />
                <TextField
                  fullWidth
                  type="password"
                  variant="standard"
                  placeholder="••••••••"
                  InputProps={{ disableUnderline: true }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* Button */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                className="bg-primary! text-black! font-bold! py-3! rounded-xl! hover:bg-primary-fixed-dim! transition-all"
              >
                {loading ? <CircularProgress size={24} /> : "Sign In"}
              </Button>
            </form>

            <div className="pt-4 flex flex-col items-center space-y-4">
              <p className="text-on-surface-variant text-sm">
                Don&apos;t have an account?
                <a
                  href="/signup"
                  className="text-on-surface font-semibold hover:text-primary ml-1"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignIn;
