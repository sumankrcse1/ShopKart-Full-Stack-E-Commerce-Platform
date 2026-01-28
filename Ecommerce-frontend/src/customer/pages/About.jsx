import React from 'react'
import { Github, Linkedin, Code2, Sparkles } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full mb-4 backdrop-blur-sm border border-purple-500/30">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Portfolio Project</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            About This Project
          </h1>
          <p className="text-gray-400 text-lg">
            A modern e-commerce demo built with passion
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              SK
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Suman Kumar</h2>
              <p className="text-purple-300 text-lg">Java Full Stack Developer</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-10"></div>

          {/* Project Info */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-semibold text-white">Project Overview</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">
              This is a <span className="text-purple-400 font-semibold">demonstration project</span> showcasing modern web development techniques. 
              It's designed as a portfolio piece and <span className="text-pink-400 font-semibold">not a real e-commerce platform</span>. 
              The project demonstrates proficiency in React, modern UI/UX design patterns, and responsive web development.
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">Connect With Me</h3>
            
            {/* GitHub */}
            <a 
              href="https://github.com/sumankrcse1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">GitHub</p>
                <p className="text-gray-400 text-sm">github.com/sumankrcse1</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/sumankumar43/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">LinkedIn</p>
                <p className="text-gray-400 text-sm">linkedin.com/in/sumankumar43</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Footer Note */}
          <div className="mt-10 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <p className="text-purple-200 text-sm text-center">
              💡 This project is for demonstration purposes only. No real transactions are processed.
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  )
}

export default About