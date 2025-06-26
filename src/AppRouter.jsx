import { HashRouter, Route, Routes } from "react-router-dom";
import CallbackPage from './CallbackPage';
import Login from './Login';

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<CallbackPage />} />
        {/* Not sure why I need to do this, but GH pages seems to have some wonky interactions with React/front end routing */}
        <Route path="/%2Fcallback" element={<CallbackPage />} /> 
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;