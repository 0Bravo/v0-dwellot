"use client"

import CampaignNavbar from "./components/CampaignNavbar"
import HeroSection from "./components/HeroSection"
import StatsBar from "./components/StatsBar"
import FeaturedProperties from "./components/FeaturedProperties"
import HowItWorks from "./components/HowItWorks"
import Testimonials from "./components/Testimonials"
import BottomCTA from "./components/BottomCTA"
import CampaignFooter from "./components/CampaignFooter"
import FloatingWhatsApp from "./components/FloatingWhatsApp"

export default function BuyPropertyGhanaPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <CampaignNavbar />
      <HeroSection />
      <StatsBar />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <BottomCTA />
      <CampaignFooter />
      <FloatingWhatsApp />
    </div>
  )
}
