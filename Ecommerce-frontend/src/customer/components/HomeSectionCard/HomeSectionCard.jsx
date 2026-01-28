import React from 'react';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';


const HomeSectionCard = ({ title, subtitle, image, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      sx={{
        height: 400,
        borderRadius: 4,
        mx: 1.5,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 0.7s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      />

      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: 'black',
          opacity: isHovered ? 0.4 : 0.3,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Decorative Circle */}
      <Box
        sx={{
          position: 'absolute',
          top: 32,
          right: 32,
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '4px solid white',
          opacity: 0.2,
          transition: 'transform 0.5s ease',
          transform: isHovered ? 'scale(1.5)' : 'scale(1)',
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 4,
        }}
      >
        <Box
          sx={{
            transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
            transition: 'transform 0.5s ease',
          }}
        >
          <Chip
            label="Trending Now"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              fontWeight: 500,
              mb: 2,
            }}
          />

          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: 'white',
              opacity: 0.9,
              mb: 3,
              fontWeight: 400,
            }}
          >
            {subtitle}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'white',
              fontWeight: 600,
              transition: 'gap 0.3s ease',
              '&:hover': {
                gap: 2,
              }
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              Shop Collection
            </Typography>
            <ArrowRight
              style={{
                width: 20,
                height: 20,
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
              }}
            />
          </Box>
        </Box>

        {/* Animated Border */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            border: '2px solid white',
            opacity: isHovered ? 0.2 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      </CardContent>
    </Card>
  );
};

export default HomeSectionCard;