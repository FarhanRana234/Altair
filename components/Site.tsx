"use client";

import { useState } from "react";
import { useScroll } from "framer-motion";
import Starfield from "./Starfield";
import HeroCanvas from "./HeroCanvas";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AeroPakistanIntro from "./AeroPakistanIntro";
import TrackRecord from "./TrackRecord";
import ProjectShowcase from "./ProjectShowcase";
import Team from "./Team";
import EventsSection from "./EventsSection";
import Sponsorship from "./Sponsorship";
import Footer from "./Footer";
import SponsorshipFormModal from "./SponsorshipFormModal";

export default function Site() {
  const [sponsorshipOpen, setSponsorshipOpen] = useState(false);
  const openSponsorship = () => setSponsorshipOpen(true);

  const { scrollYProgress } = useScroll();

  return (
    <>
      <Starfield />
      <HeroCanvas progress={scrollYProgress} />
      <Navbar onSponsorClick={openSponsorship} />
      <main className="relative z-10">
        <Hero />
        <AeroPakistanIntro />
        <TrackRecord />
        <ProjectShowcase />
        <Team />
        <EventsSection />
        <Sponsorship onSponsorClick={openSponsorship} />
      </main>
      <Footer />
      <SponsorshipFormModal
        open={sponsorshipOpen}
        onClose={() => setSponsorshipOpen(false)}
      />
    </>
  );
}