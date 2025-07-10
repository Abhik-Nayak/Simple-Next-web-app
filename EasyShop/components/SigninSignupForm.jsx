"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";

const SigninSignupForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error); // 👈 show error
      } else {
        toast.success("Login successful!");
        // Optional: redirect manually
        window.location.href = "/";
      }
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Signup successful! You can now login.");
        setIsLogin(true);
      } else {
        const { error } = await res.json();
        toast.error(error || "Signup failed");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <button
          className={`w-1/2 py-2 ${
            isLogin ? "font-bold border-b-2 border-blue-600" : ""
          }`}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button
          className={`w-1/2 py-2 ${
            !isLogin ? "font-bold border-b-2 border-blue-600" : ""
          }`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      {isLogin && (
        <button
          onClick={() => signIn("google")}
          className="w-full mt-4 border border-gray-400 py-2 rounded"
        >
          Continue with Google
        </button>
      )}
    </div>
  );
};

export default SigninSignupForm;
