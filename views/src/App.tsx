import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { NavBar } from './features/NavBar/NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Subcategories } from './features/Subcategories/Subcategories';


function App() {
  return (

    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <NavBar />
        <Routes>
          <Route 
            path="/"
            element={<Home />}
          />  
          <Route 
            path="/guitars"
            element={<Subcategories category="guitars" />}
          />
        </Routes>
      </div >
    </BrowserRouter>

  );
}

export default App;
