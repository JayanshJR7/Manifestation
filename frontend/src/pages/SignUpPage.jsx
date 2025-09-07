import { useState } from "react"
import { userAuthStore } from "../Store/useAuthStore"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import MainBg from "../components/MainBg";
import FloatingOrbs from "../components/FloatingOrbs";

const SignUpPage = () => {
  const [ShowPassword, setShowPassword] = useState(false)
  const [FormData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const { signup, isSigningUp } = userAuthStore()
  const validateForm = () => {
    if (!FormData.fullName.trim()) {
      toast.error("Full name is required")
      return false  // Explicitly return false
    }
    if (!FormData.email.trim()) {
      toast.error("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(FormData.email)) {
      toast.error("Invalid email format")
      return false
    }
    if (!FormData.password) {
      toast.error("Password is required")
      return false
    }
    if (FormData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return false  // This will now properly block form submission
    }

    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) {  // This check will now work properly
      signup(FormData)
    }
  }


  return (
    <MainBg>
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* left side */}
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* logo */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-1/2 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mt-2">Create Account</div>
                <div className="text-base-content/60">Get started with your free account</div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <User className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-12`}
                    placeholder="Your name"
                    value={FormData.fullName}
                    onChange={(e) => setFormData({ ...FormData, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="size-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-12"
                    placeholder="you@example.com"
                    value={FormData.email}
                    onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={ShowPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-12`}
                    placeholder="••••••••"
                    value={FormData.password}
                    onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!ShowPassword)}
                  >
                    {ShowPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
         <div className="hidden lg:block relative">
          <FloatingOrbs />
        </div>
      </div>
    </MainBg>
  )
}

export default SignUpPage

