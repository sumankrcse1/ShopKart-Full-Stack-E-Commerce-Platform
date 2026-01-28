import React from 'react';
import MainCarousel from '../../components/HomeCarousel/MainCarousel';
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel';
import Product from '../../components/Product/Product';

const HomePage = () => {
  return (
    <div>
      <MainCarousel />

      <HomeSectionCarousel/>

      <Product/>
    </div>
  );
};

export default HomePage;
