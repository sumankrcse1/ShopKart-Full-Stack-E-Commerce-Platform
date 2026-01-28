import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, ShoppingCart, Info } from 'lucide-react';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    
    const footerLinks = {
        Company: [
            { name: 'About', path: '/about' },
            { name: 'Blog', path: '/blog' },
            { name: 'Press', path: '/press' },
            { name: 'Jobs', path: '/jobs' },
            { name: 'Partners', path: '/partners' }
        ],
        Solutions: [
            { name: 'Marketing', path: '/marketing' },
            { name: 'Analytics', path: '/analytics' },
            { name: 'Commerce', path: '/commerce' },
            { name: 'Insight', path: '/insight' },
            { name: 'Support', path: '/support' }
        ],
        Documentation: [
            { name: 'Guides', path: '/guides' },
            { name: 'API Status', path: '/api-status' }
        ],
        Legal: [
            { name: 'Claim', path: '/claim' },
            { name: 'Privacy', path: '/privacy' },
            { name: 'Terms', path: '/terms' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600', url: 'https://facebook.com' },
        { icon: Twitter, label: 'Twitter', color: 'hover:bg-sky-500', url: 'https://twitter.com' },
        { icon: Instagram, label: 'Instagram', color: 'hover:bg-pink-600', url: 'https://instagram.com' },
        { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700', url: 'https://www.linkedin.com/in/sumankumar43/' },
        { icon: Youtube, label: 'YouTube', color: 'hover:bg-red-600', url: 'https://youtube.com' }
    ];

    const handleLinkClick = (path) => {
        navigate(path);
    };

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Disclaimer Banner */}
                <div className="mb-8 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-l-4 border-purple-500 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <p className="text-gray-300 italic text-sm">
                            This is a project, not a real shopping application
                        </p>
                    </div>
                </div>

                {/* Top Section - Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pb-8 border-b border-gray-700">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-3xl font-bold">
                                <span className="text-white">Shop</span>
                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Kart</span>
                            </span>
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted destination for the latest fashion trends and timeless elegance.
                        </p>
                        
                        {/* Contact Info */}
                        <div className="space-y-3">
                            {[
                                { icon: Phone, text: '+91 123-4567-89' },
                                { icon: Mail, text: 'support@shopkart.com' },
                                { icon: MapPin, text: '123 Fashion Ave,  12345' }
                            ].map((item, index) => (
                                <div 
                                    key={index}
                                    className="flex items-center gap-3 group cursor-pointer transition-transform hover:translate-x-2"
                                >
                                    <item.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="lg:col-span-3">
                        <h3 className="text-xl font-semibold text-white mb-2">Stay Updated</h3>
                        <p className="text-gray-400 mb-4 text-sm">
                            Subscribe to our newsletter for exclusive deals and latest arrivals.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                            />
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            By subscribing, you agree to our Privacy Policy and consent to receive updates.
                        </p>
                    </div>
                </div>

                {/* Links Section */}
                <div className="grid grid-cols-4 gap-16 py-10 bg-slate-900/50 px-8 rounded-lg">
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="flex flex-col">
                            <h4 className="text-white font-bold mb-6 text-lg relative inline-block">
                                {category}
                                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></span>
                            </h4>
                            <ul className="space-y-3 flex-1">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <button
                                            onClick={() => handleLinkClick(link.path)}
                                            className="text-gray-400 hover:text-white transition-all duration-200 text-left w-full hover:translate-x-1 inline-block text-sm group"
                                        >
                                            <span className="group-hover:border-b group-hover:border-purple-400">
                                                {link.name}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 pt-6">
                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Copyright */}
                        <p className="text-gray-400 text-sm">
                            © {currentYear} <span className="text-white font-semibold">ShopKart</span>. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm mr-2">Follow us:</span>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>

                        {/* Payment Methods */}
                        <div className="flex items-center gap-3 flex-wrap justify-center">
                            <span className="text-gray-400 text-sm">We accept:</span>
                            <div className="flex gap-2">
                                {[
                                    { name: 'Visa', gradient: 'from-blue-700 to-blue-500' },
                                    { name: 'Rupay', gradient: 'from-blue-500 to-cyan-400' },
                                    { name: 'PayPal', gradient: 'from-blue-600 to-blue-400' }
                                ].map((card) => (
                                    <div 
                                        key={card.name} 
                                        className={`px-3 py-1.5 bg-gradient-to-br ${card.gradient} rounded text-xs font-bold text-white shadow-md min-w-[50px] text-center`}
                                    >
                                        {card.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;