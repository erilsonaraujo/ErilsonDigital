import Hero from '../components/Hero';
import Authority from '../components/Authority';
import AISection from '../components/AISection';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import Contact from '../components/Contact';
import BookingSection from '../components/BookingSection';
import ErrorBoundary from '../components/ErrorBoundary';
import Process from '../components/Process';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <Authority />
            <Services />
            <Process />
            <Projects />
            <Testimonials />
            <ErrorBoundary>
                <BookingSection />
            </ErrorBoundary>
            <About />
            <Contact />
        </div>
    );
}
