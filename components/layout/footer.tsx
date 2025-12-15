"use client";

const Footer = () => {
  return (
    <footer className="py-6 text-center text-sm text-slate-400 bg-white border-t border-slate-100">
      <p>
        &copy; {new Date().getFullYear()} WiFaKey Authentication Service. All
        rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
