import React, { useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Card, CardContent, Chip } from '@mui/material';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import CategoryCard from '../HomeSectionCard/HomeSectionCard';


const ModernCategoryCarousel = () => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    {
      title: "Winter Warmth",
      subtitle: "Cozy layers for cold days",
      image: "https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=800&q=80",
    },
    {
      title: "Urban Chic",
      subtitle: "Street style that turns heads",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    },
    {
      title: "Summer Vibes",
      subtitle: "Fresh looks for sunny days",
      image: "https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&q=80",
    },
    {
      title: "Festive Fashion",
      subtitle: "Celebrate in style",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    },
    {
      title: "Minimalist",
      subtitle: "Less is more elegance",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    },
    {
      title: "Boho Dreams",
      subtitle: "Free-spirited elegance",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    },
    {
      title: "Bold & Brave",
      subtitle: "Make a statement",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80",
    },
    {
      title: "Evening Glam",
      subtitle: "Shine after dark",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    },
    {
      title: "Classic Luxury",
      subtitle: "Timeless sophistication",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    },
    {
      title: "Denim Days",
      subtitle: "Casual never looked better",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
    },
    {
      title: "Active Life",
      subtitle: "Performance meets style",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
    },
    {
      title: "Spring Fresh",
      subtitle: "Bloom into new season",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    },
    {
      title: "Autumn Tones",
      subtitle: "Warm hues, cool vibes",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    },
    {
      title: "Office Ready",
      subtitle: "Power dressing redefined",
      image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
    },
    {
      title: "Beach Breeze",
      subtitle: "Vacation mode activated",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    }
  ];

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      const newScroll = direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });

      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      const newIndex = Math.round((newScroll / maxScroll) * (categories.length - 1));
      setCurrentIndex(Math.max(0, Math.min(newIndex, categories.length - 1)));
    }
  };

  return (
    <Box sx={{ py: 8, px: 2, bgcolor: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}>
      {/* Section Header */}
      <Box sx={{ maxWidth: 1280, mx: 'auto', mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
              Discover Your Style
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'white',
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'scale(1.1)',
                  bgcolor: 'white',
                }
              }}
            >
              <ChevronLeft size={24} />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                width: 56,
                height: 56,
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'scale(1.1)',
                  background: 'linear-gradient(to right, #7e22ce, #db2777)',
                }
              }}
            >
              <ChevronRight size={24} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Carousel Container */}
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box
          ref={carouselRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: 3,
            pb: 2,
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          {categories.map((category, index) => (
            <Box key={index} sx={{ flexShrink: 0, width: 384 }}>
              <CategoryCard {...category} delay={index * 100} />
            </Box>
          ))}
        </Box>

        {/* Progress Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
          {categories.map((_, index) => (
            <Button
              key={index}
              onClick={() => {
                const scrollAmount = (index / (categories.length - 1)) * (carouselRef.current.scrollWidth - carouselRef.current.clientWidth);
                carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                setCurrentIndex(index);
              }}
              sx={{
                minWidth: 0,
                width: index === currentIndex ? 48 : 8,
                height: 8,
                borderRadius: 2,
                p: 0,
                background: index === currentIndex
                  ? 'linear-gradient(to right, #9333ea, #ec4899)'
                  : '#d1d5db',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: index === currentIndex
                    ? 'linear-gradient(to right, #9333ea, #ec4899)'
                    : '#9ca3af',
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Mobile Navigation Buttons */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 1.5, mt: 4 }}>
        <IconButton
          onClick={() => scroll('left')}
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'white',
            boxShadow: 2,
          }}
        >
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton
          onClick={() => scroll('right')}
          sx={{
            width: 48,
            height: 48,
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            color: 'white',
            boxShadow: 2,
          }}
        >
          <ChevronRight size={20} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ModernCategoryCarousel;