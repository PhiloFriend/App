import React from "react";
import { Container } from "@mui/joy";
import { aboutPageContent } from "../data/aboutPageContent";
import { Hero } from "../components/about/Hero";
import { Challenge } from "../components/about/Challenge";
import { Introduction } from "../components/about/Introduction";
import { HowItWorks } from "../components/about/HowItWorks";
import { Benefits } from "../components/about/Benefits";
import { Testimonials } from "../components/about/Testimonials";
import { VisionMission } from "../components/about/VisionMission";
import { CallToAction } from "../components/about/CallToAction";
import { Founders } from "../components/about/Founders";

export const AboutPage: React.FC = () => {
  return (
    <>
      <Hero
        title={aboutPageContent.title}
        subtitle={aboutPageContent.subtitle}
      />
      {aboutPageContent.sections.map((section, index) => {
        switch (section.title) {
          case "The Challenge of Gaining Wisdom":
            // @ts-ignore
            return <Challenge key={index} {...section} />;
          case "Introducing PhiloFriend":
            // @ts-ignore
            return <Introduction key={index} {...section} />;
          case "How PhiloFriend Works":
            // @ts-ignore
            return <HowItWorks key={index} {...section} />;
          case "Benefits of Using PhiloFriend":
            // @ts-ignore
            return <Benefits key={index} {...section} />;
          case "Real Stories, Real Impact":
            // @ts-ignore
            return <Testimonials key={index} {...section} />;
          case "Our Vision and Mission":
            // @ts-ignore
            return <VisionMission key={index} {...section} />;
          default:
            return null;
        }
      })}
      <CallToAction {...aboutPageContent.cta} />
      <Founders founders={aboutPageContent.founders} />
    </>
  );
};

export default AboutPage;
