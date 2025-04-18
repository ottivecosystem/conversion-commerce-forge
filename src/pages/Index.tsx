
import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoSection from '@/components/home/PromoSection';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import Brands from '@/components/home/Brands';
import { useCartStore } from '@/lib/store';

const Index = () => {
  const { initCart } = useCartStore();

  useEffect(() => {
    // Initialize cart when page loads
    initCart();
  }, [initCart]);

  return (
    <Layout>
      <Hero />
      <Brands />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoSection />
      <Testimonials />
      <Newsletter />
    </Layout>
  );
};

export default Index;
