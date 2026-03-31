import { DeveloperCTA } from "@/components/home/developer-cta";
import { FeatureGrid } from "@/components/home/feature-grid";
import { HeroSection } from "@/components/home/hero-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureGrid />
        <DeveloperCTA />
      </main>
      <Footer />
    </>
  );
}