import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone } from "lucide-react";
import { motion } from "framer-motion";
import uploadStyles from "../../styles/upload.module.scss";
import { signIn, signUp } from "@/services/authService";
import { toast } from "sonner";
import { getSupabaseClient } from '@/lib/supabase';
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

// Initialize Supabase client
const supabase = getSupabaseClient();

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
}

const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][
    strength
  ];
  const strengthColor = ["#ff4444", "#ffbb33", "#ffeb3b", "#00C851", "#007E33"][
    strength
  ];

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-[#3A3A3A] rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${Math.max((strength / 5) * 100, 0)}%`,
              backgroundColor: strengthColor,
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{strengthText}</span>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (activeTab === "signup") {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }

      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!validatePassword(formData.password)) {
        newErrors.password = "Password must meet all requirements";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Please enter a valid 10-digit mobile number";
      }
    } else {
      if (!formData.email) {
        newErrors.email = "Email is required";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (activeTab === "signup") {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName
        );
        if (error) {
          throw new Error(error.message);
        }
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        setActiveTab("login");
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          throw new Error(error.message);
        }
        toast.success("Logged in successfully!");
        navigate("/spider");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });

      if (error) {
        console.error('Google Sign-in Error:', error);
        throw error;
      }

      // The redirect will happen automatically based on Supabase configuration
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      setError(err.message || "An error occurred during Google sign in");
      toast.error(err.message || "An error occurred during Google sign in");
    }
  };

  const starfieldVariants = undefined;
  const ellipseVariants = undefined;

  return (
    <div className="flex flex-col min-h-screen bg-[#E8E8E8] grain-texture">
      <div className="flex-grow flex flex-row items-center justify-center gap-12">
        {/* Left blank card */}
        <Card className="w-[35vw] h-[80vh] rounded-[16px] border-none flex flex-col" style={{ background: 'linear-gradient(180deg, #765E54 0%, #312119 100%)' }}>
          <div className="pt-8 pl-8 text-white text-[32px] font-normal" style={{ fontFamily: 'Fustat, sans-serif' }}>
            Spider
          </div>
          <div className="flex-1 flex items-center justify-center">
            {activeTab === "login" ? (
              <img src="/images/loginspark.svg" alt="Login Spark" className="w-[90%] max-w-[600px] h-auto" />
            ) : (
              <img src="/images/signup.svg" alt="Signup Spark" className="w-[90%] max-w-[600px] h-auto" />
            )}
          </div>
        </Card>
        {/* Right login/signup section */}
        <div>
          <div className="flex justify-left mb-6">
            <div className="bg-[#D4D4D4] rounded-xl p-2 flex">
              <button
                className={`px-6 py-2 text-base font-normal rounded-md transition-all duration-200 focus:outline-none
                  ${activeTab === "login"
                    ? "bg-[#362716] text-white shadow"
                    : "bg-transparent text-[#404040]"
                  }
                `}
                style={{ marginRight: '4px' }}
                onClick={() => {
                  setActiveTab("login");
                  setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                  });
                  setErrors({});
                }}
              >
                Log In
              </button>
              <button
                className={`px-6 py-2 text-base font-normal rounded-md transition-all duration-200 focus:outline-none
                  ${activeTab === "signup"
                    ? "bg-[#362716] text-white shadow"
                    : "bg-transparent text-[#404040]"
                  }
                `}
                onClick={() => {
                  setActiveTab("signup");
                  setFormData({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    mobile: "",
                  });
                  setErrors({});
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <Card className="min-w-[676px] bg-[#F9F6F3] border border-[#E0E0E0] rounded-[16px] shadow-none">
              {error && (
                <motion.div
                  className="mb-4 text-destructive text-sm text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {activeTab === "login" ? (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6 w-full min-w-[548px]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2 pt-8 px-8">
                      <label className="block text-sm font-medium text-black text-left">
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.email ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-4 text-[#202020] placeholder:text-[#888] focus:outline-none`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      {errors.email && (
                        <span className="text-destructive text-sm">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between pb-8 px-8 items-center">
                        <label className="block text-sm font-medium text-black text-left">
                          Password
                        </label>
                        <span
                          className="text-sm text-[#949494] hover:text-[#949494]/80 cursor-pointer"
                          onClick={() => navigate("/auth/forgot-password")}
                        >
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative pb-8 px-8">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.password ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-10 text-[#202020] placeholder:text-[#888] focus:outline-none`}
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-12 top-1/4 text-[#696969] hover:text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <span className="text-destructive text-sm">
                          {errors.password}
                        </span>
                      )}
                      <div className="mt-6 rounded-b-[16px] w-full overflow-hidden p-8" style={{
                        background: 'radial-gradient(circle at bottom, #E7CDC1 0%, #6FC3D4 100%)',
                      }}>
                        <div className="flex gap-4">
                          <motion.button
                            type="button"
                            className="w-full border border-[#BDBDBD] bg-white/80 text-[#000000] rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-white/100"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleSignIn}
                          >
                            <img
                              src="/google-white-icon.svg"
                              alt="Google"
                              className="w-5 h-5"
                            />
                            Sign in with Google
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="w-full bg-[#232323] text-white rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#111]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                          >
                            {loading ? "Signing in..." : "Sign In"}
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>



                  </motion.form>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6 w-full min-w-[548px] mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2 px-8 pt-8">
                      <label className="block text-sm font-medium text-black text-left">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.fullName ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-4 text-[#202020] placeholder:text-[#888] focus:outline-none `}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      {errors.fullName && (
                        <span className="text-destructive text-sm">
                          {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 px-8">
                      <label className="block text-sm font-medium text-black text-left">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.email ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-4 text-[#202020] placeholder:text-[#888] focus:outline-none `}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      {errors.email && (
                        <span className="text-destructive text-sm">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 px-8">
                      <label className="block text-sm font-medium text-black text-left">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.password ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-10 text-[#202020] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/10 transition-colors duration-200`}
                          placeholder="Create a password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] hover:text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {activeTab === "signup" && (
                        <PasswordStrength password={formData.password} />
                      )}
                      {errors.password && (
                        <span className="text-destructive text-sm">
                          {errors.password}
                        </span>
                      )}

                      {activeTab === "signup" && (
                        <div className="mt-2 text-xs text-muted-foreground text-left">
                          <p className="mb-1 font-medium text-[#414141]">
                            Password requirements:
                          </p>
                          <ul className="list-disc pl-4 text-[#414141] space-y-0.5">
                            <li
                              className={
                                formData.password.length >= 8
                                  ? "text-green-500"
                                  : ""
                              }
                            >
                              At least 8 characters long
                            </li>
                            <li
                              className={
                                /[A-Z]/.test(formData.password)
                                  ? "text-green-500"
                                  : ""
                              }
                            >
                              Contains at least one uppercase letter
                            </li>
                            <li
                              className={
                                /[a-z]/.test(formData.password)
                                  ? "text-green-500"
                                  : ""
                              }
                            >
                              Contains at least one lowercase letter
                            </li>
                            <li
                              className={
                                /[0-9]/.test(formData.password)
                                  ? "text-green-500"
                                  : ""
                              }
                            >
                              Contains at least one number
                            </li>
                            <li
                              className={
                                /[^A-Za-z0-9]/.test(formData.password)
                                  ? "text-green-500"
                                  : ""
                              }
                            >
                              Contains at least one special character
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 px-8">
                      <label className="block text-sm font-medium text-black text-left">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.confirmPassword ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-10 text-[#202020] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/10 transition-colors duration-200`}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#696969] hover:text-black"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className="text-destructive text-sm">
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 px-8 ">
                      <label className="block text-sm font-medium text-black text-left">
                        Mobile No.
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          className={`w-full h-16 bg-transparent border ${errors.mobile ? "border-destructive" : "border-[#BDBDBD]"} rounded-lg py-2 pl-4 pr-4 text-[#202020] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white/10 transition-colors duration-200`}
                          placeholder="Enter your mobile number"
                        />
                      </div>
                      {errors.mobile && (
                        <span className="text-destructive text-sm">
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 rounded-b-[16px] overflow-hidden" style={{
                      background: 'radial-gradient(circle at bottom, #E7CDC1 0%, #6FC3D4 100%)',
                     
                      padding: '24px 32px 32px'
                    }}>
                      <div className="flex gap-4">
                        <motion.button
                          type="button"
                          className="w-full border border-[#BDBDBD] bg-white/80 text-[#000000] rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-white/100"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleGoogleSignIn}
                        >
                          <img
                            src="/google-white-icon.svg"
                            alt="Google"
                            className="w-5 h-5"
                          />
                          Sign up with Google
                        </motion.button>
                        <motion.button
                          type="submit"
                          className="w-full bg-[#232323] text-white rounded-lg py-4 flex items-center justify-center gap-2 font-medium transition-colors duration-200 hover:bg-[#111]"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                        >
                          {loading ? "Creating account..." : "Sign Up"}
                          <ArrowRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.form>

                )}

              </motion.div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
