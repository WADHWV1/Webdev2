import './App.css';
import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import AdvancedJS from './AdvancedJS';//import AdvancedJS Component
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FAQ from './FAQ';
import Invoice from './Invoice1';



export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (<>{
      <>
        <BrowserRouter>

          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/advancedJS" element={<AdvancedJS />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/invoice" element={<Invoice />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </>
    }</>
    );
  }
}


// Export this component
export default App;
