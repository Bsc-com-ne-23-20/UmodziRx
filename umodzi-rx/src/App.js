import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import PrescriptionManagement from './components/PrescriptionManagement';
import PrescriptionVerification from './components/PrescriptionVerification';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard role="Doctor" />} />
                <Route path="/prescription-management" element={<PrescriptionManagement />} />
                <Route path="/prescription-verification" element={<PrescriptionVerification />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;