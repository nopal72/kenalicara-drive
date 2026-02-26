// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { routes } from "@/routes";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content">
          <Routes>
            {routes.map((route) => (
              <Route path={route.url} element={<route.component />} key={route.title} />
            ))}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
