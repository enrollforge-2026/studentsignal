import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import DirectAdmissions from '../components/home/DirectAdmissions';
import UniqueSearch from '../components/home/UniqueSearch';
import Testimonials from '../components/home/Testimonials';
import SchoolTools from '../components/home/SchoolTools';
import CompareSchools from '../components/home/CompareSchools';
import BestOfLists from '../components/home/BestOfLists';
import PartnerSchools from '../components/home/PartnerSchools';
import CTASection from '../components/home/CTASection';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <DirectAdmissions />
        <UniqueSearch />
        <Testimonials />
        <SchoolTools />
        <CompareSchools />
        <BestOfLists />
        <PartnerSchools />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
