import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, ShieldCheckIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon, WifiIcon, HomeIcon, PhoneIcon, MapIcon, ChatBubbleLeftRightIcon, ScaleIcon, XMarkIcon, InformationCircleIcon, AcademicCapIcon, CubeIcon, ServerIcon } from '@heroicons/react/24/outline';
import { EmergencyNumbers } from './components/EmergencyNumbers';
import { LegalInformation } from './components/LegalInfo';
import { Chatbot } from './components/Chatbot';
import Login from './components/Login';
import Signup from './components/Signup';
import Logo from './components/Logo';
import Footer from './components/Footer';
import { AboutUs } from './components/AboutUs';
import { AlertsPage } from './pages/AlertsPage';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { EmergencyAlert } from './components/EmergencyAlert';
import { Navbar } from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import { CreateAlert } from './pages/CreateAlert';
import { ForumPage } from './pages/ForumPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { OurGoalsPage } from './pages/OurGoalsPage';
import { TechStackPage } from './pages/TechStackPage';
import { SafeZonesPage } from './pages/SafeZonesPage';
import { ExampleDataComponent } from './components/ExampleDataComponent';
import DataInitializer from './components/DataInitializer';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AuthProvider>
      {/* Initialize data only once per browser */}
      <DataInitializer />
      
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Splash Screen */}
        <AnimatePresence>
          {showSplash && <SplashScreen />}
        </AnimatePresence>

        {/* Cyber Grid Background */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          
          {/* Cyber Grid */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-fade"></div>
            </div>
          </div>

          {/* Glowing Lines */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-glow"></div>
            </div>
          </div>

          {/* Cyber Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>

          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Header */}
          {!isAuthPage && (
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-white/10">
              <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                  {/* Logo */}
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-2">
                      <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        ResQ360
                      </span>
                    </Link>
                  </div>

                  {/* Desktop Navigation */}
                  <div className="hidden sm:flex items-center space-x-8">
                    <Link to="/login" className="text-white/70 hover:text-white transition-colors">
                      Login
                    </Link>
                    <Link to="/signup" className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                      Sign Up
                    </Link>
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {isMenuOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                      ) : (
                        <Bars3Icon className="h-6 w-6" />
                      )}
                    </button>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="sm:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {isMenuOpen ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="sm:hidden overflow-hidden"
                    >
                      <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                          to="/login"
                          className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          Login
                        </Link>
                        <Link
                          to="/signup"
                          className="block px-3 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors text-center"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>
            </header>
          )}

          {/* Popup Sidebar */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                />
                {/* Sidebar */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="fixed right-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-lg border-l border-white/10 z-50 shadow-xl"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Menu</h2>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Link to="/emergency-numbers" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <PhoneIcon className="h-5 w-5" />
                        <span>Emergency Numbers</span>
                      </Link>
                      <Link to="/legal-rights" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ScaleIcon className="h-5 w-5" />
                        <span>Legal Rights</span>
                      </Link>
                      <Link to="/forum" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>Community Forum</span>
                      </Link>
                      <Link to="/about" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <InformationCircleIcon className="h-5 w-5" />
                        <span>About Us</span>
                      </Link>
                      <Link to="/our-goals" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <AcademicCapIcon className="h-5 w-5" />
                        <span>Our Goals</span>
                      </Link>
                      <Link to="/tech-stack" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <CubeIcon className="h-5 w-5" />
                        <span>Tech Stack</span>
                      </Link>
                      <Link to="/safe-zones" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <MapIcon className="h-5 w-5" />
                        <span>Safe Zones</span>
                      </Link>
                      <Link to="/safety-assistant" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>Safety Assistant</span>
                      </Link>
                      <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <HomeIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/sample-data" className="flex items-center space-x-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <ServerIcon className="h-5 w-5" />
                        <span>Sample Data</span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className={!isAuthPage ? 'pt-16 sm:pt-20' : ''}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <>
                      {/* Hero Section */}
                      <div className="text-center relative py-12 sm:py-20">
                        <div className="relative z-10">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto"
                          >
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6">
                              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                ResQ360
                              </span>
                            </h1>
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                              Your Safety Guardian
                            </h2>
                            <p className="text-lg sm:text-xl text-white/70 mb-8 sm:mb-12 max-w-2xl mx-auto">
                              Your personal safety companion, online or offline.
                            </p>
                            <Link to="/emergency-numbers">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary-dark hover:via-purple-600 hover:to-pink-600 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg shadow-primary/20"
                              >
                                Get Started
                              </motion.button>
                            </Link>
                          </motion.div>
                        </div>
                      </div>

                      {/* Features Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 py-12 sm:py-20">
                        <Link to="/emergency-numbers" className="group">
                          <div className="glass-effect p-6 sm:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105">
                            <PhoneIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">Emergency Numbers</h3>
                            <p className="text-white/70">Quick access to emergency contacts and helplines.</p>
                          </div>
                        </Link>
                        <Link to="/legal-rights" className="group">
                          <div className="glass-effect p-6 sm:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105">
                            <ScaleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">Legal Rights</h3>
                            <p className="text-white/70">Know your rights and access legal resources.</p>
                          </div>
                        </Link>
                        <Link to="/safe-zones" className="group">
                          <div className="glass-effect p-6 sm:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105">
                            <MapIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">Safe Zones</h3>
                            <p className="text-white/70">Find nearby safe locations and emergency services.</p>
                          </div>
                        </Link>
                      </div>

                      {/* About Us Section */}
                      <AboutUs />

                      {/* Users Said Section */}
                      <div className="py-12 sm:py-20 mt-20">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center mb-12"
                        >
                          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Users Say</h2>
                          <p className="text-white/70 max-w-2xl mx-auto">
                            Hear from our community about how ResQ360 has helped them stay safe.
                          </p>
                        </motion.div>

                        <div className="max-w-4xl mx-auto">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Review 1 */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                              className="glass-effect p-6 rounded-xl relative group"
                            >
                              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">A</span>
                              </div>
                              <div className="mt-4">
                                <div className="flex text-yellow-400 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <p className="text-white/90 italic mb-4">
                                  "ResQ360 has been a lifesaver! The emergency numbers feature helped me quickly find help when I needed it most."
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/70">5.0</span>
                                  <div className="text-primary font-semibold">Verified User</div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Review 2 */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="glass-effect p-6 rounded-xl relative group"
                            >
                              <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">S</span>
                              </div>
                              <div className="mt-4">
                                <div className="flex text-yellow-400 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <p className="text-white/90 italic mb-4">
                                  "The Safety Assistant feature is incredible! It provides instant guidance in emergency situations."
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/70">5.0</span>
                                  <div className="text-primary font-semibold">Verified User</div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Review 3 */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="glass-effect p-6 rounded-xl relative group"
                            >
                              <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">R</span>
                              </div>
                              <div className="mt-4">
                                <div className="flex text-yellow-400 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <p className="text-white/90 italic mb-4">
                                  "The offline functionality is a game-changer. I feel safe even without internet connection."
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/70">5.0</span>
                                  <div className="text-primary font-semibold">Verified User</div>
                                </div>
                              </div>
                            </motion.div>

                            {/* Review 4 */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="glass-effect p-6 rounded-xl relative group"
                            >
                              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-xl font-bold text-white">M</span>
                              </div>
                              <div className="mt-4">
                                <div className="flex text-yellow-400 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <p className="text-white/90 italic mb-4">
                                  "The real-time alerts feature kept me informed about potential safety concerns in my area."
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-white/70">5.0</span>
                                  <div className="text-primary font-semibold">Verified User</div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </>
                  } />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/emergency-numbers" element={<EmergencyNumbers />} />
                  <Route path="/legal-rights" element={<LegalInformation />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/our-goals" element={<OurGoalsPage />} />
                  <Route path="/tech-stack" element={<TechStackPage />} />
                  <Route path="/safe-zones" element={<SafeZonesPage />} />
                  <Route path="/safety-assistant" element={<Chatbot />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/alerts/new" element={<CreateAlert />} />
                  <Route path="/sample-data" element={<ExampleDataComponent />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>

          {/* Footer */}
          {!isAuthPage && <Footer />}

          {/* Floating Chatbot */}
          <Chatbot />

          {/* Offline Indicator */}
          {!isOnline && (
            <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg">
              <WifiIcon className="h-5 w-5" />
              <span>You're offline</span>
            </div>
          )}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;