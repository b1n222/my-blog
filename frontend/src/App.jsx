import "./App.css";

import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Write from "./pages/Write";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/register">회원가입</Link>
        <Link to="/login">로그인</Link>
        <Link to="/write">글쓰기</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<h2>홈페이지 환영</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="write" element={<Write />} />
      </Routes>
    </div>
  );
}

export default App;
