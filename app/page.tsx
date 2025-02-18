import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainContent from "@/components/Main-Content";

export default function Page() {
  return (
    <div className="bg-background">
      <Header />
      <main>
        <Hero />
        <MainContent />
      </main>
      <Footer />
    </div>
  )
}

