import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import uploadStyles from "../../styles/upload.module.scss";
import { toast } from "sonner";
import landingStyles from "../landing/styles/LandingPage.module.scss";
import { getSupabaseClient } from '@/lib/supabase';
import Footer from "@/components/Footer";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Check if we have access to update password
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link");
        navigate("/auth/login");
      }
    };

    checkAccess();
  }, [navigate, supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        throw error;
      }

      toast.success("Password updated successfully!");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF8]">
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className={landingStyles.backgroundElements} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
        <div className={landingStyles.ellipselog}>
          <img
            src="/images/white-radial.svg"
            alt="Radial gradient"
            width={1000}
            height={1000}
          />
        </div>
      </div>

      <div className="flex-grow">
        <div className="flex justify-center pt-20">
          <img
            src="/images/navlogo.svg"
            alt="logo"
            className="w-[40px] h-[42px] mb-10"
          />
        </div>

        <div className="flex items-center justify-center px-4">
          <div className={`${uploadStyles.gradientWrapper} w-[676px] min-h-[500px] max-w-[90vw]`}>
            <img
              src="/images/backgroundgradiant.png"
              alt="Gradient Background"
              className={uploadStyles.gradientBackground}
            />
            <div className={`${uploadStyles.innerBox} w-full h-full p-8 flex flex-col`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">Set New Password</h2>
                <p className="text-muted-foreground text-center mb-8">
                  Please enter your new password below.
                </p>

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

                <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[548px] mx-auto">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white text-left">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full h-16 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg py-2 pl-4 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white text-left">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full h-16 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg py-2 pl-4 pr-10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className={`${uploadStyles.analyzeButton} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/auth/login")}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default ResetPassword; 