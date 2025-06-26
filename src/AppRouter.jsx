import { HashRouter, Route, Routes } from "react-router-dom";
import CallbackPage from './CallbackPage';
import Login from './Login';

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="jammming/" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="jammming/callback" element={<CallbackPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/%2Fcallback" element={<CallbackPage />} />
        <Route path="jammming/%2Fcallback" element={<CallbackPage />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;