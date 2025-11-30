// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import FadeInOnScroll from "../components/FadeInOnScroll"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* HERO SECTION */}
      <main className="pt-34"> {/* pt-28 supaya konten tidak ketutup navbar */}
        <section className="w-10/12 mx-auto flex flex-col items-center text-center">
          {/* Headline */}
          <div className="max-w-2xl mx-auto mb-8">
            <FadeInOnScroll className="flex flex-col items-center text-center" delay={0}>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Detect Your Acne{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">
                Instantly with AI.
              </span>
            </h1>
            </FadeInOnScroll>
            
            <FadeInOnScroll className="flex flex-col items-center text-center" delay={300}>
            <p className="mt-8 mb-4 text-slate-600 text-sm md:text-base">
              Get an instant analysis of your skin condition using AI-powered acne
              detection. Simple, fast, and designed to help you understand your
              skin better.
            </p>
            </FadeInOnScroll>
          </div>

          {/* Hero image (1 kesatuan gambar: wajah + card kiri/kanan) */}
          <FadeInOnScroll className="flex flex-col items-center text-center" delay={300}>
          <div className="w-full flex justify-center">
            <div className="relative w-full max-w-5xl">
              <img
                src="/hero-acne.png" // ganti dengan nama file gambarmu di folder public
                alt="Acne detection illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
          </FadeInOnScroll>

          {/* Tombol Start Detection */}
          <FadeInOnScroll className="flex flex-col items-center text-center" delay={0}>
          <div className="mt-2 mb-10">
            <Link
              to="/detection"
              className="px-8 py-4 rounded-full text-sm md:text-base font-medium text-white bg-gradient-to-r from-blue-500 to-sky-400 hover:opacity-90 transition shadow-lg"
            >
              Start Detection
            </Link>
          </div>
          </FadeInOnScroll>
        </section>

        <section className="mt-16 bg-[#f3f6ff] pb-8">
          <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Title */}
            <FadeInOnScroll className="flex flex-col items-center text-center" delay={0}>
            <h2 className="text-3xl md:text-[34px] font-semibold text-slate-900 text-center mb-10">
              How it Works
            </h2>
            </FadeInOnScroll>

            {/* Steps */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">
                {/* Step 1 */}
                <FadeInOnScroll className="flex flex-col items-center text-center" delay={200}>
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                    <Icon
                    icon="solar:gallery-wide-broken"
                    className="text-4xl text-blue-500"
                    />
                </div>
                <p className="text-base md:text-lg font-semibold text-slate-900">
                    Take/Upload Photo
                </p>
                <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xs">
                    Capture your face using the camera or upload a clear photo of
                    your skin.
                </p>
                </FadeInOnScroll>

                {/* Step 2 */}
                <FadeInOnScroll className="flex flex-col items-center text-center" delay={400}>
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                    <Icon
                    icon="ph:sparkle-duotone"
                    className="text-4xl text-blue-500"
                    />
                </div>
                <p className="text-base md:text-lg font-semibold text-slate-900">
                    AI Analysis
                </p>
                <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xs">
                    Our AI model analyzes acne spots and evaluates your skin condition.
                </p>
                </FadeInOnScroll>

                {/* Step 3 */}
                <FadeInOnScroll className="flex flex-col items-center text-center" delay={600}>
                <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                    <Icon
                    icon="ph:clipboard-text-duotone"
                    className="text-4xl text-blue-500"
                    />
                </div>
                <p className="text-base md:text-lg font-semibold text-slate-900">
                    Result &amp; Advice
                </p>
                <p className="text-xs md:text-sm text-slate-500 mt-2 max-w-xs">
                    View the analysis result and get basic advice for your skin care steps.
                </p>
                </FadeInOnScroll>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
            {/* Text kiri */}
            <FadeInOnScroll delay={200}>
            <div>
                <h2 className="text-3xl md:text-[34px] font-semibold text-slate-900 mb-6">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">Acne Detection</span>
                </h2>

                <p className="text-slate-700 leading-relaxed text-sm md:text-base max-w-xl">
                Acne Detection is an artificial intelligence-based platform designed
                to automatically analyze facial skin conditions. By simply uploading
                or taking a photo of your face, our system will detect the number of
                acne breakouts, determine their severity, and provide appropriate
                analysis and recommendations.
                </p>
            </div>
            </FadeInOnScroll>

            {/* Gambar kanan */}
            <FadeInOnScroll delay={400} className="flex justify-center">
            <img
                src="/about-acne.png"  // ganti sesuai nama file ilustrasimu
                alt="AI acne detection illustration"
                className="w-95 max-w-md md:max-w-lg h-auto"
            />
            </FadeInOnScroll>
        </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}