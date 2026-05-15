import { LandingNav } from "@/components/landing/nav";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { ShowcaseSection } from "@/components/landing/showcase";
import { PricingSection } from "@/components/landing/pricing";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { FaqSection } from "@/components/landing/faq";
import { CtaSection } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ShowcaseSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
