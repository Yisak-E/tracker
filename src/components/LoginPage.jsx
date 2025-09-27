// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function LoginPage({ setUser }) {
    const [useremail, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
      e.preventDefault();
    if (useremail === 'yisakdemelash7@gmail.com' && password === '123') {
      setUser({ name: useremail });
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-900">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-green-100 to-white lg:h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm" onClick={()=>navigate('/')}>
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-2 border-gray-200 p-4 ">
          <form className="space-y-6"  onSubmit={handleLogin}>
               {/* action="" method="POST"*/}
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
                  onChange={(e) => setUseremail(e.target.value)}
                  className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-gray-300 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{' '}
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
