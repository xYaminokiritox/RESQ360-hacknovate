import React from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  PuzzlePieceIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon,
  FlagIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export const OurGoalsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Our Vision & Mission
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Building safer communities through technology, accessibility, and connectivity
          </p>
        </motion.div>
        
        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-red-500/20 rounded-lg">
              <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Problem Statement</h2>
              <p className="text-white/90 mb-4">
                In times of crisis, individuals often struggle to access critical safety information and contact emergency services efficiently. Existing solutions are fragmented, often requiring internet connectivity, and don't sufficiently address community-based safety reporting and response mechanisms.
              </p>
              <p className="text-white/90">
                Additionally, vulnerable populations may face barriers in reporting incidents due to privacy concerns, lack of knowledge about available resources, or fear of repercussions. This creates an urgent need for a comprehensive, accessible safety platform that works both online and offline.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Our Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-green-500/20 rounded-lg">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Solution</h2>
              <p className="text-white/90 mb-4">
                ResQ360 is a comprehensive safety platform designed to address these challenges by providing:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4 mb-4">
                <li>Real-time emergency alerts and reporting with location data</li>
                <li>Anonymous community forum for sharing safety concerns</li>
                <li>Offline accessibility for critical information</li>
                <li>AI-powered assistance for emergency guidance</li>
                <li>Integration with local emergency services and resources</li>
                <li>Inclusive design that prioritizes user privacy and ease of use</li>
              </ul>
              <p className="text-white/90">
                By combining these features in a single platform, ResQ360 creates a unified safety ecosystem that empowers individuals and communities to better respond to and recover from emergencies.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-blue-500/20 rounded-lg">
              <FlagIcon className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Goals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Accessibility</h3>
                  <p className="text-white/90">
                    Make crucial safety information and emergency services accessible to everyone, regardless of internet connectivity or technical expertise.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Community Empowerment</h3>
                  <p className="text-white/90">
                    Create a platform where communities can share information, support each other during crises, and collaborate on safety initiatives.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy Protection</h3>
                  <p className="text-white/90">
                    Ensure users can report incidents and seek help without compromising their privacy or personal security.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Rapid Response</h3>
                  <p className="text-white/90">
                    Reduce response times for emergencies through real-time alerts, precise location sharing, and streamlined communication channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Innovation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-purple-500/20 rounded-lg">
              <LightBulbIcon className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Innovation</h2>
              <p className="text-white/90 mb-6">
                ResQ360 stands out through several key innovations that differentiate it from existing safety applications:
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <RocketLaunchIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Hybrid Online/Offline Architecture</h3>
                    <p className="text-white/90">
                      Unlike most safety apps that require constant internet connectivity, ResQ360 caches critical information locally and uses progressive web app technology to function effectively even when offline.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RocketLaunchIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">AI-Assisted Emergency Response</h3>
                    <p className="text-white/90">
                      Our Gemini-powered AI assistant provides personalized guidance during emergencies, helping users navigate complex situations when human support isn't immediately available.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RocketLaunchIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Anonymous Community Safety Network</h3>
                    <p className="text-white/90">
                      The forum's anonymous reporting feature removes barriers to reporting sensitive incidents like harassment or threats, while still providing valuable community safety information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RocketLaunchIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Unified Safety Ecosystem</h3>
                    <p className="text-white/90">
                      By integrating emergency contacts, legal information, community reporting, and AI assistance in one platform, ResQ360 creates a comprehensive safety solution unlike any other available today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-effect p-8 rounded-xl mb-16"
        >
          <div className="flex items-start space-x-6">
            <div className="p-4 bg-yellow-500/20 rounded-lg">
              <ShieldCheckIcon className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Expected Impact</h2>
              <p className="text-white/90 mb-4">
                ResQ360 aims to create meaningful change in how individuals and communities respond to safety concerns:
              </p>
              <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
                <li>Reduced emergency response times through better information sharing</li>
                <li>Increased reporting of incidents, especially those that might otherwise go unreported</li>
                <li>Greater community awareness of local safety concerns</li>
                <li>Improved accessibility to safety resources for vulnerable populations</li>
                <li>Enhanced preparedness for various emergency scenarios</li>
                <li>Strengthened community bonds through collaborative safety initiatives</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 