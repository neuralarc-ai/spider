import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import uploadStyles from "../../styles/upload.module.scss";
import { toast } from "sonner";
import { StarField } from "@/components/StarField";
import landingStyles from "../landing/styles/LandingPage.module.scss";
import { getSupabaseClient } from '@/lib/supabase';
import Footer from "@/components/Footer";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = getSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get the current origin without any hash or trailing slashes
      const origin = window.location.origin.replace(/\/$/, '');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
        // Add additional options to ensure proper redirect
        options: {
          shouldCreateUser: false,
          data: {
            redirect_to: `${origin}/auth/reset-password`
          }
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Check your email for password reset instructions");
      navigate("/auth/login");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const starfieldVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className={landingStyles.backgroundElements} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
        <motion.div
          className={landingStyles.starfieldWrapperlog}
          variants={starfieldVariants}
          initial="hidden"
          animate="visible"
        >
          <StarField />
        </motion.div>
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
          <div className={`${uploadStyles.gradientWrapper} w-[676px] min-h-[400px] max-w-[90vw]`}>
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
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">Reset Password</h2>
                <p className="text-muted-foreground text-center mb-8">
                  Enter your email address and we'll send you instructions to reset your password.
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
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-16 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg py-2 pl-4 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className={`${uploadStyles.analyzeButton} ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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
  );
};

export default ForgotPassword; 