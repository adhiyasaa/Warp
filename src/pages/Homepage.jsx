import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ReportList from '../components/ReportList';

const Homepage = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ReportList />
      </main>

    </div>
  );
};

export default Homepage;