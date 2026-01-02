/**
 * Home Page - Landing page
 */
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import CTASection from '../components/home/CTASection';

export default function Home() {
    return (
        <div>
            <Hero />
            <Features />
            <HowItWorks />
            <CTASection />
        </div>
    );
}
