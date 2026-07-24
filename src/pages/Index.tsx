import CampaignHeader from "@/components/CampaignHeader";
import HeroSection from "@/components/HeroSection";
import ShareBar from "@/components/ShareBar";
import AboutSection from "@/components/AboutSection";
import PrioritiesSection from "@/components/PrioritiesSection";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import ContactSection from "@/components/ContactSection";
import CampaignFooter from "@/components/CampaignFooter";

const Index = () => (
  <>
    <CampaignHeader />
    <main>
      <ShareBar />
      <HeroSection />
      <AboutSection />
      <PrioritiesSection />
      <GetInvolvedSection />
      <ContactSection />
    </main>
    <CampaignFooter />
  </>
);

export default Index;
