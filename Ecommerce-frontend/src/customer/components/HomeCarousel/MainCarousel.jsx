import React, { useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCarouselData';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const MainCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  React.useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mainCarouselData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mainCarouselData.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mainCarouselData.length) % mainCarouselData.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-[500px] md:h-[650px] lg:h-[550px] overflow-hidden">
      {/* Slides */}
      {mainCarouselData.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-105 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center px-6 md:px-12 lg:px-20">
            <div className="max-w-2xl animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mb-6 shadow-2xl transform hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-gray-900" />
                <span className="text-sm font-black text-gray-900 tracking-wider">
                  {item.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight">
                {item.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 font-light tracking-wide">
                {item.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="group px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-2xl flex items-center gap-2">
                  <span>Shop Now</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300">
                  Explore More
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 z-20 border border-white/20"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-md hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 z-20 border border-white/20"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {mainCarouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? 'w-12 h-3 bg-yellow-400 shadow-lg'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default MainCarousel;
