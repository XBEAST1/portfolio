import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Work } from "@/components/work";

export default function Home(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero />
      <Work />
      <Services />
      <Experience />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
