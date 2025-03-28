import React from 'react';
import { motion } from 'framer-motion';
import { AboutUs } from '../components/AboutUs';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  MapIcon, 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  ScaleIcon,
  MapPinIcon,
  WifiIcon,
  EyeSlashIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export const AboutUsPage: React.FC = () => {
  const appFeatures = [
    {
      icon: ExclamationTriangleIcon,
      title: "Emergency Alerts",
      description: "Create and receive real-time alerts about incidents in your area. Users can report emergencies like fires, floods, accidents, medical emergencies, harassment, violence, and suspicious activities. Each alert includes severity level, location data, and descriptions."
    },
    {
      icon: MapIcon,
      title: "Interactive Alert Map",
      description: "View all active alerts on an interactive map with custom markers based on alert type. The map provides a visual representation of where incidents are occurring, allowing you to stay informed about potential dangers in your vicinity."
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Community Forum",
      description: "Engage with your community through our anonymous forum. Share concerns, seek advice, or report incidents without revealing your identity. The forum includes features like tagging, location sharing (optional), liking posts, and commenting."
    },
    {
      icon: SparklesIcon,
      title: "Gemini AI Assistant",
      description: "Access our Gemini-powered AI chatbot for personalized safety advice, information about legal rights, or guidance during emergencies. The assistant works even with limited connectivity to ensure help is always available."
    },
    {
      icon: UserGroupIcon,
      title: "Trusted Contacts",
      description: "Manage a list of emergency contacts who can be notified during crisis situations. Add family members, friends, or local authorities to your trusted network for quick communication when needed."
    },
    {
      icon: WifiIcon,
      title: "Offline Functionality",
      description: "Access critical safety information even without an internet connection. The app checks your connectivity status and adapts to provide essential resources in offline mode."
    },
    {
      icon: DevicePhoneMobileIcon,
      title: "Emergency Numbers",
      description: "Quick access to local emergency services and helplines. A comprehensive directory of emergency contacts is available at your fingertips, organized by category and location."
    },
    {
      icon: ScaleIcon,
      title: "Legal Rights Information",
      description: "Access vital information about your legal rights in various emergency situations. Learn about your protections under the law and how to properly navigate legal procedures during crises."
    },
    {
      icon: EyeSlashIcon,
      title: "Anonymous Reporting",
      description: "Report incidents without revealing your identity. Our platform prioritizes user privacy while still allowing you to contribute important safety information to your community."
    },
    {
      icon: BellIcon,
      title: "Alert Notifications",
      description: "Receive timely notifications about emergencies in your area. Stay informed about developing situations with customizable alert settings based on severity and proximity."
    },
    {
      icon: MapPinIcon,
      title: "Safe Zones",
      description: "Find nearby safe locations and emergency services. The app can guide you to police stations, hospitals, shelters, and other safe havens during crisis situations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Us Component */}
        <AboutUs />
        
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-white/90 mb-4">
            At ResQ360, we believe that safety is a fundamental right that should be accessible to everyone. Our mission is to empower communities by providing comprehensive safety resources, real-time emergency alerts, and a supportive platform for sharing concerns and seeking help.
          </p>
          <p className="text-white/90 mb-4">
            We've built ResQ360 to bridge the gap between traditional emergency services and modern technology, creating an ecosystem where community members can look out for each other and access vital information during critical situations.
          </p>
          <p className="text-white/90">
            Whether you're facing an immediate crisis, concerned about your safety, or simply want to contribute to making your community safer, ResQ360 is designed to be your trusted companion in all aspects of personal and community safety.
          </p>
        </motion.div>
        
        {/* App Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Complete Feature Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                className="glass-effect p-6 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/90">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* How to Use */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-effect p-8 rounded-xl mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">How to Use ResQ360</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Getting Started</h3>
              <p className="text-white/90">
                Sign up for an account to access all features. While some resources are available without an account, creating one allows you to report incidents, participate in the community forum, and receive personalized alerts.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">During an Emergency</h3>
              <p className="text-white/90">
                Use the "Create Alert" feature to quickly report incidents. The app will guide you through providing the necessary details, including location data if you choose to share it. Alerts will be visible to other users in your area who can provide assistance or additional information.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Using the Community Forum</h3>
              <p className="text-white/90">
                Access the forum through the dashboard or navigation menu. Here you can create new posts, read existing discussions, and participate anonymously if desired. The forum is designed to be a safe space for sharing concerns and seeking support from your community.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Accessing Resources</h3>
              <p className="text-white/90">
                Navigate to specific sections like "Emergency Numbers" or "Legal Rights" through the dashboard or side menu. These resources are available offline once loaded, ensuring you can access critical information even without an internet connection.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Privacy and Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-effect p-8 rounded-xl mt-16 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Privacy and Security</h2>
          <p className="text-white/90 mb-4">
            At ResQ360, we take your privacy and data security seriously. We've implemented several features to protect your information:
          </p>
          <ul className="list-disc list-inside text-white/90 space-y-2 ml-4">
            <li>Anonymous reporting and posting options</li>
            <li>Optional location sharing that you control</li>
            <li>Secure data storage and transmission</li>
            <li>Transparent data usage policies</li>
            <li>No unnecessary tracking or data collection</li>
          </ul>
          <p className="text-white/90 mt-4">
            We believe that safety resources should be accessible without compromising your privacy. That's why we give you control over what information you share and when you share it.
          </p>
        </motion.div>
        
        {/* Meet the Creators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="glass-effect p-8 rounded-xl mt-16 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Meet the Creators</h2>
          <p className="text-white/90 mb-8">
            We are a team of passionate 2nd year students studying at ABES Institute of Technology in Ghaziabad. 
            Dedicated to creating innovative solutions for community safety and emergency response.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">AS</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Aryan Saini</h3>
              <p className="text-gray-400 text-sm">Full-Stack Developer & Lead Designer</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Arjun</h3>
              <p className="text-gray-400 text-sm">Full-Stack Developer & Lead Backend Developer</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">DG</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Darshita Gupta</h3>
              <p className="text-gray-400 text-sm">Full-Stack Developer & Main Presenter</p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">UG</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Utkarsh Gupta</h3>
              <p className="text-gray-400 text-sm">Full-Stack Developer & AI Assistant Developer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 