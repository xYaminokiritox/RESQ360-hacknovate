import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, HeartIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import homepageImage from '../img/homepage_image.jpg';

export const AboutUs = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Safety First",
      description: "Our primary mission is to ensure your safety and well-being through comprehensive emergency resources and support."
    },
    {
      icon: HeartIcon,
      title: "Community Driven",
      description: "Built with love for our community, we're committed to making safety resources accessible to everyone."
    },
    {
      icon: GlobeAltIcon,
      title: "Always Available",
      description: "Access emergency information and support anytime, anywhere, even when offline."
    },
    {
      icon: UserGroupIcon,
      title: "Expert Support",
      description: "Backed by professionals and community experts to provide reliable safety information."
    }
  ];

  return (
    <section className="py-16 sm:py-24 relative z-10">
      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mb-16 sm:mb-24"
      >
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50 z-10"></div>
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img
            src={homepageImage}
            alt="Emergency Response Team"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-white px-4">
              Empowering Communities Through Safety
            </h2>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About ResQ360</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            We're dedicated to making safety resources accessible to everyone. Our platform combines emergency information, legal rights, and community support to create a comprehensive safety network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-effect p-6 rounded-xl hover:bg-white/5 transition-colors"
            >
              <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/90">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-white/90 max-w-2xl mx-auto">
            Join us in our mission to create a safer, more informed community. Together, we can make a difference in ensuring everyone has access to the safety resources they need.
          </p>
        </motion.div>
      </div>
    </section>
  );
}; 