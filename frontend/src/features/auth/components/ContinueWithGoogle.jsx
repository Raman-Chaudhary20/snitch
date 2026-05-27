import React from "react";

const ContinueWithGoogle = () => {
  return (
    <>
      <div className="flex items-center my-5">
        <div className="flex-grow border-t border-neutral-200 dark:border-neutral-900/60"></div>
        <span className="mx-4 text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
          or
        </span>
        <div className="flex-grow border-t border-neutral-200 dark:border-neutral-900/60"></div>
      </div>
      
      <a
        href="/api/auth/google"
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 dark:bg-[#131314] dark:hover:bg-[#1e1e1f] border border-neutral-300 dark:border-[#8e918f] text-[#1f1f1f] dark:text-[#e3e3e3] font-medium py-2.5 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer select-none text-sm font-sans"
      >
        <svg
          className="w-[18px] h-[18px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
        <span>Continue with Google</span>
      </a>
    </>
  );
};

export default ContinueWithGoogle;

