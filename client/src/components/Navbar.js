import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  
  const [isOpen, setIsOpen] = useState(false);

  
  const authLinks = (
    <div className="flex items-center gap-6 text-sm">
      <Link to="/dashboard" className="font-medium text-[#073737] hover:underline">
        Dashboard
      </Link>
      {user?.role === 'Admin' && (
        <Link to="/directory" className="font-medium text-[#073737] hover:underline">
          Directory
        </Link>
      )}
      <Link to="/profile" className="font-medium text-[#073737] hover:underline">
        Profile
      </Link>
      <button
        onClick={logout}
        className="px-3 py-2 font-semibold text-white bg-[#073737] border border-transparent rounded-md hover:bg-[#0a4f4f] transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center gap-4">
      <Link
        to="/login"
        className="px-4 py-2 font-medium text-[#073737] hover:underline"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className="px-4 py-2 font-medium text-white bg-[#073737] rounded-md hover:bg-[#0a4f4f] transition-colors duration-200 shadow-sm"
      >
        Sign Up
      </Link>
    </div>
  );
  
  // --- MOBILE LINKS (Same links, different container styling) ---
  const mobileAuthLinks = (
    <div className="flex flex-col items-start gap-4 pt-4 pb-2">
      <Link to="/dashboard" className="px-3 py-2 w-full text-left font-medium text-[#073737] hover:bg-gray-200 rounded-md" onClick={() => setIsOpen(false)}>
        Dashboard
      </Link>
      {user?.role === 'Admin' && (
        <Link to="/directory" className="px-3 py-2 w-full text-left font-medium text-[#073737] hover:bg-gray-200 rounded-md" onClick={() => setIsOpen(false)}>
          Directory
        </Link>
      )}
      <Link to="/profile" className="px-3 py-2 w-full text-left font-medium text-[#073737] hover:bg-gray-200 rounded-md" onClick={() => setIsOpen(false)}>
        Profile
      </Link>
      <button
        onClick={() => { logout(); setIsOpen(false); }}
        className="w-full mt-2 px-3 py-2 font-semibold text-white bg-[#073737] rounded-md hover:bg-[#0a4f4f] transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );
  
  const mobileGuestLinks = (
     <div className="flex flex-col items-start gap-2 pt-4 pb-2">
      <Link to="/login" className="px-3 py-2 w-full text-left font-medium text-[#073737] hover:bg-gray-200 rounded-md" onClick={() => setIsOpen(false)}>
        Login
      </Link>
      <Link to="/signup" className="px-3 py-2 w-full text-left font-medium text-white bg-[#073737] rounded-md hover:bg-[#0a4f4f]" onClick={() => setIsOpen(false)}>
        Sign Up
      </Link>
    </div>
  );

  return (
    <nav className="bg-[#FDFFD4] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#073737]">
          FinanceVault
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          {/* Hidden on small screens, visible on medium and up */}
          <div className="hidden md:block">{isAuthenticated ? authLinks : guestLinks}</div>

          {/* --- MOBILE HAMBURGER BUTTON --- */}
          {/* Visible on small screens, hidden on medium and up */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#073737] hover:bg-gray-200 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon: Hamburger or Close */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE DROPDOWN MENU --- */}
      {/* Conditionally rendered based on isOpen state */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
           <div className="px-2 sm:px-3">
             {isAuthenticated ? mobileAuthLinks : mobileGuestLinks}
           </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar;