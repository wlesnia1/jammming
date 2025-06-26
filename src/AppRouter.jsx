import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CallbackPage from './CallbackPage';
import Login from './Login';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="jammming/" element={<Login />} />
        <Route path="jammming/callback" element={<CallbackPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;