import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children, variants }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // SVG Icon Components for clarity - updated with new theme colors
  const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const ReceiptIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const TeamIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );


  return (
    <div className="bg-[#073737] text-[#FDFFD4]">
      {/* Hero Section */}
      <div className=" h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-[#0a4f4f] rounded-lg">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-extrabold text-[#FDFFD4]">
          Welcome to <span className="text-emerald-400">FinanceVault</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 w-full mx-auto text-lg md:text-xl text-[#FDFFD4]/80">
          Finance dashboard for your organization: role-based access for <strong className="text-[#FDFFD4]">Viewers</strong>,{' '}
          <strong className="text-[#FDFFD4]">Analysts</strong>, and <strong className="text-[#FDFFD4]">Admins</strong> — summaries,
          records, and secure user management in one place.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-10 flex w-full gap-4">
          <Link
            to="/signup"
            className="inline-block bg-emerald-500 text-white font-semibold py-4 px-10 rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            Get Started for Free
          </Link>
          <Link
            to="/login"
            className="inline-block bg-transparent border-2 border-[#FDFFD4] text-[#FDFFD4] font-semibold py-4 px-10 rounded-lg hover:bg-[#FDFFD4]/10 transition-colors duration-300"
          >
            Login
          </Link>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <div className="py-28">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variants={fadeInUp}>
            <div className="">
              <h2 className="text-base font-semibold text-emerald-400 tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-4xl font-extrabold text-[#FDFFD4] tracking-tight sm:text-5xl">
                Everything you need, nothing you don't.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection variants={staggerContainer}>
            <div className="mt-20 grid gap-10 md:grid-cols-3">
              <motion.div variants={fadeInUp} className="text-center p-8 border border-[#FDFFD4]/20 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mx-auto">
                  <ReceiptIcon />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Financial records</h3>
                <p className="mt-3 text-base text-[#FDFFD4]/80">
                  Comprehensive transaction tracking for income and expenses. View detailed logs with categories and notes, or filter data based on your specific organizational role
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center p-8 border border-[#FDFFD4]/20 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mx-auto">
                  <TeamIcon />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Roles & access control</h3>
                <p className="mt-3 text-base text-[#FDFFD4]/80">
                  Secure, multi-tier permission system. Granular access control for Viewers, Analysts, and Admins ensures data integrity and privacy across your entire team
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="text-center p-8 border border-[#FDFFD4]/20 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-400/50">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mx-auto">
                  <ReportIcon />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Dashboard analytics</h3>
                <p className="mt-3 text-base text-[#FDFFD4]/80">
                  Real-time visual insights including net balance, category spending breakdowns, and monthly trends powered by high-performance database aggregation
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-28 bg-[#0a4f4f]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection variants={fadeInUp}>
              <div className=" mb-20">
                  <h2 className="text-base font-semibold text-emerald-400 tracking-wide uppercase">How It Works</h2>
                  <p className="mt-2 text-4xl font-extrabold text-[#FDFFD4] tracking-tight sm:text-5xl">Get started in 3 simple steps</p>
              </div>
            </AnimatedSection>
            <AnimatedSection variants={staggerContainer}>
              <div className="grid md:grid-cols-3 gap-12 relative">
                  {/* Dotted line connector for desktop */}
                  <div className="hidden md:block absolute top-12 left-0 w-full h-px">
                    <div className="border-t-2 border-dashed border-[#FDFFD4]/30 h-full w-full" style={{ transform: 'translateY(-50%)' }}></div>
                  </div>

                  <motion.div variants={fadeInUp} className="text-center z-10">
                      <div className="flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-[#073737] border-4 border-emerald-400 text-3xl font-bold text-emerald-400">1</div>
                      <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Create Your Account</h3>
                      <p className="mt-3 text-base text-[#FDFFD4]/80">Sign up in seconds and set up your company profile. No credit card required.</p>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="text-center z-10">
                      <div className="flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-[#073737] border-4 border-emerald-400 text-3xl font-bold text-emerald-400">2</div>
                      <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Invite your team</h3>
                      <p className="mt-3 text-base text-[#FDFFD4]/80">As Admin, create users and assign Viewer, Analyst, or Admin with active / inactive status.</p>
                  </motion.div>
                  <motion.div variants={fadeInUp} className="text-center z-10">
                      <div className="flex items-center justify-center mx-auto w-24 h-24 rounded-full bg-[#073737] border-4 border-emerald-400 text-3xl font-bold text-emerald-400">3</div>
                      <h3 className="mt-6 text-xl font-semibold text-[#FDFFD4]">Use the dashboard</h3>
                      <p className="mt-3 text-base text-[#FDFFD4]/80">Role-specific views provide instant clarity—from aggregate high-level summaries for Viewers to full transaction management for Admins</p>
                  </motion.div>
              </div>
            </AnimatedSection>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-[#0a4f4f] py-28">
        <AnimatedSection variants={fadeInUp}>
          <div className=" mx-auto px-8">
            <h2 className="text-4xl font-extrabold text-[#FDFFD4] sm:text-5xl">
              Ready to run finance with clear roles?
            </h2>
            <p className="mt-6 text-lg text-[#FDFFD4]/80">
              Sign up creates your organization and an Admin account. Add Viewers and Analysts when you are ready.
            </p>
            <div className="mt-10">
              <Link
                to="/signup"
                className="inline-block bg-emerald-500 text-white font-semibold py-4 px-12 rounded-lg shadow-lg hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default HomePage;
