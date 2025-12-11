import { useState } from "react";
import { ShipWheelIcon, Mail, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router"; // or "react-router-dom"
import useLogin from "../hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-950">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative w-full max-w-5xl bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
      >

        {/* LEFT SIDE: FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative z-10">

          {/* Logo */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-lg shadow-lg">
              <ShipWheelIcon className="size-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Streamify
            </span>
          </motion.div>

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Enter your credentials to access your account.
            </p>
          </motion.div>

          {/* Error Message with Animation */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-200 overflow-hidden"
              >
                <AlertCircle className="size-5 shrink-0" />
                <span className="text-sm">{error.response?.data?.message || "Something went wrong"}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 size-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="hello@example.com"
                  className="w-full bg-gray-950/50 border border-gray-700 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 size-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-950/50 border border-gray-700 text-gray-100 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-xs text-primary hover:text-primary-focus transition-colors">Forgot Password?</a>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm bg-white"></span>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline decoration-primary underline-offset-4">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE: IMAGE/ART */}
        <div className="hidden lg:flex w-1/2 relative bg-gray-800 items-center justify-center overflow-hidden">
          {/* Abstract Pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30"></div>

          <div className="relative z-10 p-12 text-center max-w-md">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative aspect-square mb-8"
            >
              {/* Floating Animation for Image */}
              <motion.img
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                src="/i.png"
                alt="Illustration"
                className="w-full h-full object-contain drop-shadow-2xl"
              />

              {/* Decorative Circle behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl -z-10 transform scale-90"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Connect Globally</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Join a community of learners. Practice conversations and improve your language skills together.
              </p>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default LoginPage;