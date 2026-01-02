/**
 * Main App Component with Routing
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Analyzer from './pages/Analyzer';
import About from './pages/About';
import Demo from './pages/Demo';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-black text-white flex flex-col">
                <Routes>
                    {/* Analyzer route without header/footer for full-screen editor */}
                    <Route path="/analyzer" element={<Analyzer />} />

                    {/* All other routes with header/footer */}
                    <Route
                        path="*"
                        element={
                            <>
                                <Header />
                                <main className="flex-1">
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                        <Route path="/about" element={<About />} />
                                        <Route path="/demo" element={<Demo />} />
                                    </Routes>
                                </main>
                                <Footer />
                            </>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
