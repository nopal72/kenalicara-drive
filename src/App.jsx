import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "@/routes";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route path={route.url} element={<route.component />} key={route.title} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
