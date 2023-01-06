import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navigator from './components/navbar/Navigator';
import Home from './pages/home/Home';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Footer from './components/footer/Footer';

import { 
  BrowserRouter,
  Routes,
  Route 
} from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <div className="main">
        <Navigator/>
        <Routes>
          <Route path="/" element = {<Home/>}/>
          <Route path="/About" element = {<About/>}/>
          <Route path="/Contact" element = {<Contact/>}/>
        </Routes>
        <Footer/>
    </div>
  </BrowserRouter>
  
);


