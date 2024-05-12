import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { NavBar } from './features/NavBar/NavBar';
import { SlidingAd } from './features/SlidingAd/SlidingAd';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header/>
      <NavBar />
      <Home />
    </div>
  );
}

export default App;
