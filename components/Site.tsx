"use client";

import { useRef, useState } from "react";
import { useScroll } from "framer-motion";
import Starfield from "./Starfield";
import HeroCanvas from "./HeroCanvas";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AeroPakistanIntro from "./AeroPakistanIntro";
import ProjectShowcase from "./ProjectShowcase";
import Specifications from "./Specifications";
import TrackRecord from "./TrackRecord";
import Team from "./Team";
import EventsSection from "./EventsSection";
import Sponsorship from "./Sponsorship";
import Footer from "./Footer";
import SponsorshipFormModal from "./SponsorshipFormModal";

export default function Site() {
  const [sponsorshipOpen, setSponsorshipOpen] = useState(false);
  const openSponsorship = () => setSponsorshipOpen(true);

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  return (
    <>
      <Starfield />
      <HeroCanvas progress={scrollYProgress} />
      <Navbar onSponsorClick={openSponsorship} />
      <main className="relative z-10">
        <div ref={stageRef}>
          <Hero />
          <AeroPakistanIntro />
          <ProjectShowcase />
          <Specifications />
        </div>
        <TrackRecord />
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