import React from 'react';
import { motion } from 'framer-motion';
import { 
  CodeBracketIcon, 
  ServerIcon, 
  PaintBrushIcon, 
  CpuChipIcon,
  CubeIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

export const TechStackPage: React.FC = () => {
  const frontendTechnologies = [
    {
      name: "React",
      description: "JavaScript library for building user interfaces with reusable components.",
      icon: "react.svg",
      color: "bg-blue-500"
    },
    {
      name: "TypeScript",
      description: "Strongly typed programming language that builds on JavaScript for better tooling.",
      icon: "typescript.svg",
      color: "bg-blue-600"
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for rapidly building custom user interfaces.",
      icon: "tailwind.svg",
      color: "bg-cyan-500"
    },
    {
      name: "Framer Motion",
      description: "React library for creating fluid animations and interactions.",
      icon: "framer.svg",
      color: "bg-purple-500"
    },
    {
      name: "React Router",
      description: "Standard library for routing in React applications.",
      icon: "react-router.svg",
      color: "bg-red-500"
    }
  ];

  const backendTechnologies = [
    {
      name: "Firebase",
      description: "Platform for building web and mobile applications without server-side code.",
      icon: "firebase.svg",
      color: "bg-yellow-500"
    },
    {
      name: "Firestore",
      description: "NoSQL document database for storing, syncing, and querying data.",
      icon: "firestore.svg",
      color: "bg-orange-500"
    },
    {
      name: "Firebase Authentication",
      description: "User authentication and identity management service.",
      icon: "firebase-auth.svg",
      color: "bg-green-500"
    },
    {
      name: "Firebase Cloud Functions",
      description: "Serverless computing solution for handling backend logic.",
      icon: "cloud-functions.svg",
      color: "bg-yellow-600"
    }
  ];

  const aiTechnologies = [
    {
      name: "Google Gemini API",
      description: "State-of-the-art multimodal AI model from Google for generating text, analyzing images, and more.",
      icon: "gemini.svg",
      color: "bg-purple-600"
    },
    {
      name: "Natural Language Processing",
      description: "AI technology used to process and understand human language for the chatbot.",
      icon: "nlp.svg",
      color: "bg-indigo-500"
    }
  ];

  const deploymentTools = [
    {
      name: "GitHub",
      description: "Version control and collaboration platform for code.",
      icon: "github.svg",
      color: "bg-gray-700"
    },
    {
      name: "Vercel",
      description: "Platform for deploying and hosting web applications.",
      icon: "vercel.svg",
      color: "bg-black"
    },
    {
      name: "Progressive Web App",
      description: "Technology to build applications that work both online and offline.",
      icon: "pwa.svg",
      color: "bg-blue-700"
    }
  ];

  const developmentTools = [
    {
      name: "Visual Studio Code",
      description: "Source code editor with powerful development features.",
      icon: "vscode.svg",
      color: "bg-blue-500"
    },
    {
      name: "npm",
      description: "Package manager for JavaScript modules and dependencies.",
      icon: "npm.svg",
      color: "bg-red-600"
    },
    {
      name: "ESLint",
      description: "Static code analysis tool for identifying problematic patterns in JavaScript code.",
      icon: "eslint.svg",
      color: "bg-purple-700"
    }
  ];

  const renderTechnologySection = (title: string, icon: React.ReactNode, technologies: any[], delay: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-effect p-8 rounded-xl mb-12"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-primary/20 rounded-lg">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologies.map((tech, index) => (
          <div key={tech.name} className="bg-white/5 rounded-lg p-5 hover:bg-white/10 transition-colors">
            <div className="flex items-center mb-3">
              <div className={`w-10 h-10 ${tech.color} rounded-lg flex items-center justify-center mr-3`}>
                <span className="text-white font-bold">{tech.name.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
            </div>
            <p className="text-white/80 text-sm">{tech.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

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
            Our Tech Stack
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The technologies powering ResQ360's safety platform
          </p>
        </motion.div>

        {/* Architecture Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-effect p-8 rounded-xl mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">System Architecture</h2>
          <p className="text-white/90 mb-6">
            ResQ360 is built with a modern, scalable architecture designed for reliability and performance in both online and offline scenarios. We utilize a progressive web app approach with client-side caching for critical resources, supported by Firebase's real-time database and authentication services.
          </p>
          <div className="bg-white/5 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-blue-500/20 rounded-full mb-4">
                  <CodeBracketIcon className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Frontend</h3>
                <p className="text-white/80 text-sm">
                  React, TypeScript, and Tailwind CSS for responsive user interfaces
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-orange-500/20 rounded-full mb-4">
                  <ServerIcon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Backend</h3>
                <p className="text-white/80 text-sm">
                  Firebase services for data storage, authentication, and serverless functions
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-purple-500/20 rounded-full mb-4">
                  <CpuChipIcon className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Integration</h3>
                <p className="text-white/80 text-sm">
                  Google Gemini API for intelligent chatbot assistance and threat analysis
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Frontend Section */}
        {renderTechnologySection(
          "Frontend Technologies", 
          <PaintBrushIcon className="w-8 h-8 text-primary" />, 
          frontendTechnologies,
          0.2
        )}
        
        {/* Backend Section */}
        {renderTechnologySection(
          "Backend & Database", 
          <ServerIcon className="w-8 h-8 text-primary" />, 
          backendTechnologies,
          0.3
        )}
        
        {/* AI Section */}
        {renderTechnologySection(
          "AI Technologies", 
          <CpuChipIcon className="w-8 h-8 text-primary" />, 
          aiTechnologies,
          0.4
        )}
        
        {/* Deployment Section */}
        {renderTechnologySection(
          "Deployment & Hosting", 
          <CloudIcon className="w-8 h-8 text-primary" />, 
          deploymentTools,
          0.5
        )}
        
        {/* Development Tools Section */}
        {renderTechnologySection(
          "Development Tools", 
          <CubeIcon className="w-8 h-8 text-primary" />, 
          developmentTools,
          0.6
        )}
        
        {/* Why We Chose These Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="glass-effect p-8 rounded-xl mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Why We Chose These Technologies</h2>
          <div className="space-y-6">
            <p className="text-white/90">
              Our technology choices were driven by several key considerations:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Performance & Reliability</h3>
                <p className="text-white/80">
                  React and TypeScript provide a robust foundation for building reliable, type-safe applications. Firebase offers excellent uptime and scalability for our backend services.
                </p>
              </div>
              
              <div className="bg-white/5 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Offline Capabilities</h3>
                <p className="text-white/80">
                  Progressive Web App technologies allow critical features to work without internet access, ensuring help is available even in connectivity-challenged situations.
                </p>
              </div>
              
              <div className="bg-white/5 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Updates</h3>
                <p className="text-white/80">
                  Firebase's real-time database enables instant alert notifications and updates, critical for emergency response applications.
                </p>
              </div>
              
              <div className="bg-white/5 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">AI Assistance</h3>
                <p className="text-white/80">
                  Google's Gemini API provides state-of-the-art language capabilities that enhance our chatbot with contextual understanding of emergency situations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 