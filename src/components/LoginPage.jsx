// LoginPage.jsx - Updated navigation logic
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from '../firebaseConfig.js';

export default function LoginPage({ setUser }) {
  const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Monitor authentication state - this should handle navigation
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, user:", user);
      if (user) {
        setUser(user);
        console.log("Navigating to dashboard...");
        navigate('/dashboard', { replace: true }); // Use replace to avoid back button issues
      }
    });

    return () => unsubscribe();
  }, [setUser, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      console.log("Starting Google sign-in...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful, user:", result.user);

      // The onAuthStateChanged listener above should handle navigation
      // But we can also navigate here as a fallback
      setUser(result.user);

      // Double-check navigation
      setTimeout(() => {
        if (window.location.pathname !== '/dashboard') {
          console.log("Fallback navigation to dashboard");
          navigate('/dashboard', { replace: true });
        }
      }, 100);

    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(`Google sign-in failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInWithEmailAndPassword(auth, useremail, password);
      setUser(result.user);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a debug button to check current state
  const debugState = () => {
    console.log("Current user:", auth.currentUser);
    console.log("Current path:", window.location.pathname);
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-green-100 to-white lg:h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        {/* Debug button - remove in production */}
        <button
          onClick={debugState}
          className="mt-2 text-xs text-gray-500"
        >
          Debug State
        </button>
      </div>

      {/* Rest of your component remains the same */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 border-gray-200 p-4 rounded-lg">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Your form fields */}
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={useremail}
                onChange={(e) => setUseremail(e.target.value)}
                className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-black border border-gray-300 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-700">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-black border border-gray-300 placeholder:text-gray-500 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent disabled:opacity-50"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="h-5 w-5"
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}