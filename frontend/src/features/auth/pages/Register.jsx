import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Initialize theme mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Sync theme mode with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

 
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    role: 'buyer',
  });

  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked ? "seller" : "buyer" : value
    }));
       
    
    // Clear validation error on change
    if (validationError) setValidationError('');
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple frontend validation
    if (!form.fullname.trim()) {
      setValidationError("Full Name is required.");
      return;
    }
    if (!form.email.trim()) {
      setValidationError("Email Address is required.");
      return;
    }
    if (!form.contact.trim()) {
      setValidationError("Contact Number is required.");
      return;
    }
    if (!form.password.trim() || form.password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    try {
      
      await handleRegister(form);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      // Error handled by redux slice/hook
    }
  };
  

  if (success || user) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex items-center justify-center px-6 selection:bg-primary/30 selection:text-primary transition-colors duration-300">
        <div className="w-full max-w-md text-center p-8 md:p-12 glass-panel rounded-xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-3xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">Welcome to Snitch</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 font-body">
            Your account has been created successfully. Welcome aboard!
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-600 font-body animate-pulse">
            Redirecting to home page...
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-8 px-6 py-2.5 bg-primary hover:bg-primary-dark text-neutral-950 font-bold rounded-lg transition-colors text-sm cursor-pointer select-none"
          >
            Go to Home Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] flex flex-col justify-between selection:bg-primary/30 selection:text-primary relative overflow-hidden font-body text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
      
      {/* Top Navbar */}
      <header className="bg-white/70 dark:bg-neutral-900/40 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900/60 fixed top-0 w-full z-50 transition-colors duration-300">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
          <div 
            onClick={() => navigate('/')} 
            className="text-2xl font-black tracking-tighter text-primary cursor-pointer font-display select-none transition-opacity hover:opacity-90"
          >
            Snitch
          </div>
          <div className="flex items-center space-x-6 text-xs font-semibold">
            <button className="text-neutral-500 hover:text-primary transition-colors cursor-pointer">Help</button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-neutral-600 dark:text-neutral-500 hover:text-primary transition-colors flex items-center gap-2 cursor-pointer select-none font-bold"
            >
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              <span className={`w-2.5 h-2.5 rounded-full inline-block transition-all duration-300 ${darkMode ? 'bg-primary shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'bg-neutral-400 dark:bg-neutral-600'}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="grow flex items-center justify-center pt-28 pb-16 px-6">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-3 transition-colors duration-300">
              Join with us.
            </h1>
            <p className="text-neutral-500 max-w-sm mx-auto text-sm leading-relaxed">
              Create your account to access our exclusive platform for <b className="text-primary">Elevate Your Fashion.</b>
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden transition-all duration-300">
            {/* Aesthetic Side Ribbon */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60"></div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Display Validation or Submission Error */}
              {(validationError || error) && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm flex items-start gap-2.5 animate-in fade-in duration-300">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{validationError || error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="fullname">
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="John Doe"
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg px-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="contact">
                  Contact Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={form.contact}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg pl-12 pr-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-lg pl-12 pr-4 py-3 text-neutral-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-800 text-sm"
                  />
                </div>
              </div>

              {/* Seller Checkbox */}
              <label className="flex items-center group cursor-pointer py-1.5 select-none w-fit">
                <div className="relative flex items-center justify-center">
                  <input
                    id="role"
                    name="role"
                    type="checkbox"
                    checked={form.role === "seller"}
                    onChange={handleChange}
                    // onChange={(e) => setRole(e.target.checked ? "seller" : "buyer")}
                    className="peer hidden"
                  />
                  <div className="w-5.5 h-5.5 border border-neutral-300 dark:border-neutral-800 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center bg-white dark:bg-neutral-950/20 group-hover:border-neutral-400 dark:group-hover:border-neutral-600">
                    <svg className={`w-3.5 h-3.5 text-neutral-950 transition-transform ${form.role === "seller" ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="ml-3 text-sm text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                  I want to Register as Seller
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-primary hover:bg-primary-dark text-neutral-950 font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed select-none text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-neutral-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
                 {/* Continue with Google */}
                <ContinueWithGoogle />

            </form>

            <div className="mt-8 text-center border-t border-neutral-200 dark:border-neutral-900/60 pt-6">
              <p className="text-xs text-neutral-500 font-body">
                Already have an account? 
                <Link to="/login" className="text-primary hover:text-primary-dark font-bold ml-1.5 transition-colors cursor-pointer select-none">
                  Sign In
                </Link>
              </p>
            </div>

          </div>

          {/* Trust Badges */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-8 opacity-40 dark:opacity-30 hover:opacity-70 dark:hover:opacity-50 transition-opacity duration-300">
            <span className="flex items-center gap-2 font-display font-bold text-[10px] tracking-widest text-neutral-800 dark:text-white uppercase transition-colors duration-300">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure Registration
            </span>
            <span className="flex items-center gap-2 font-display font-bold text-[10px] tracking-widest text-neutral-800 dark:text-white uppercase transition-colors duration-300">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              AES-256 Encryption
            </span>
            <span className="flex items-center gap-2 font-display font-bold text-[10px] tracking-widest text-neutral-800 dark:text-white uppercase transition-colors duration-300">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Privacy First
            </span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-100/40 dark:bg-black/40 border-t border-neutral-200 dark:border-neutral-900/60 py-6 transition-colors duration-300">
        <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto text-xs">
          <div className="font-bold text-primary font-display">
            Snitch
          </div>
          <div className="text-neutral-500 dark:text-neutral-600 font-label transition-colors duration-300">
            © 2026 Snitch Marketplace. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a className="text-neutral-500 dark:text-neutral-600 hover:text-primary dark:hover:text-primary transition-colors duration-300" href="#">Privacy Policy</a>
            <a className="text-neutral-500 dark:text-neutral-600 hover:text-primary dark:hover:text-primary transition-colors duration-300" href="#">Terms of Service</a>
            <a className="text-neutral-500 dark:text-neutral-600 hover:text-primary dark:hover:text-primary transition-colors duration-300" href="#">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Register
