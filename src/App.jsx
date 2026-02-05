import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import PoemFlow from "./pages/PoemFlow";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-800">
        {/* 顶部导航 */}
        <header className="flex justify-center items-center gap-10 p-6 bg-white shadow-sm text-lg font-light text-gray-800">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/gallery" className="hover:underline">Gallery</Link>
          <Link to="/canvas" className="hover:underline">Canvas</Link>
          <Link to="/poem" className="hover:underline">Poem</Link>
        </header>

        {/* 页面内容 */}
        <main className="min-h-screen bg-white text-gray-800">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/canvas" element={<About />} />
            <Route path="/poem" element={<PoemFlow />} />
          </Routes>
        </main>

        <footer className="text-center p-6 text-sm text-gray-500 border-t">
          © {new Date().getFullYear()} Elsie. All Rights Reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
