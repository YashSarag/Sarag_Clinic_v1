import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useDispatch } from "react-redux";

import { loginSuccess } from "../redux/authSlice";

import { LOGIN_MUTATION } from "../graphql/mutations";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const [error, setError] = useState("");

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     setError("");

  //     if (!email || !password) {
  //       setError("Email and password are required.");
  //       return;
  //     }

  //     try {
  //       const { data } = await login({
  //         variables: {
  //           email,
  //           password,
  //         },
  //       });

  //       const result = data?.login;

  //       if (!result) {
  //         setError("Login failed.");
  //         return;
  //       }

  //       /*
  //        * Backend sets:
  //        *
  //        * sarag_clinic_token
  //        *
  //        * as an HttpOnly cookie.
  //        *
  //        * We don't store the token in localStorage.
  //        */
  //       console.log("LOGIN SUCCESSFULL...", result)

  //       const user = {
  //         id: result.user?.id,
  //         fname: result.user?.fname,
  //         lname: result.user?.lname,
  //         email: result.user?.email,
  //         role: result.user?.role,
  //       };

  //       // Redux
  //       dispatch(loginSuccess(user));

  //       // Role-based redirect
  //       if (user.role === "admin") {
  //         navigate("/", {
  //           replace: true,
  //         });

  //       } else if (user.role === "employee") {
  //         navigate("/records", {
  //           replace: true,
  //         });

  //       } else {
  //         setError(
  //           "Your account does not have permission to access the application."
  //         );
  //       }

  //     } catch (error) {
  //       console.error("Login error:", error);

  //       setError(
  //         error?.message ||
  //         "Invalid email or password."
  //       );
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const { data } = await login({
        variables: {
          email,
          password,
        },
      });

      console.log("LOGIN GRAPHQL RESPONSE:", data);

      const result = data?.login;

      if (!result) {
        setError("Login failed.");
        return;
      }

      console.log("LOGIN RESULT:", result);
      console.log("LOGIN USER:", result.user);
      console.log("LOGIN ROLE:", result.user?.role);

      const user = {
        id: result.user?.id,
        fname: result.user?.fname,
        lname: result.user?.lname,
        email: result.user?.email,
        role: result.user?.role,
      };

      console.log("USER TO REDUX:", user);

      // Make sure role exists
      if (!user.role) {
        setError("Login succeeded, but user role was not received.");
        return;
      }

      // Save user in Redux
      dispatch(loginSuccess(user));

      // Redirect based on role
      if (user.role === "admin") {
        console.log("Redirecting admin → /");

        navigate("/", {
          replace: true,
        });

        return;
      }

      if (user.role === "employee") {
        console.log("Redirecting employee → /records");

        navigate("/records", {
          replace: true,
        });

        return;
      }

      setError(
        `Your account does not have permission to access the application. Role: ${user.role}`,
      );
    } catch (error) {
      console.error("Login error:", error);

      setError(error?.message || "Invalid email or password.");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#0B3A6E] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Heading */}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FACC15] flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="text-3xl font-bold text-[#0F172A]">S</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white">Sarag Clinic</h1>

          <p className="text-gray-300 mt-2">Sign in to continue</p>
        </div>

        {/* Login Card */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A]/70 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-[#FACC15] transition"
              />
            </div>

            {/* Password */}

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl bg-[#0F172A]/70 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-[#FACC15] transition"
              />
            </div>

            {/* Error */}

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#FACC15] hover:bg-[#FBBF24] text-[#0F172A] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
