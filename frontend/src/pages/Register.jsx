// ⭐️ import 문 상세 주석
// 리액트의 '상태(state)'를 관리하기 위한 useState 훅을 가져옵니다.
import { useState } from "react";
// 백엔드 서버와 HTTP 통신(API 요청)을 하기 위한 axios 라이브러리를 가져옵니다.
import axios from "axios";
// 회원가입 성공 후 다른 페이지로 이동시키기 위한 useNavigate 훅을 가져옵니다.
import { useNavigate } from "react-router-dom";

function Register() {
  // 사용자가 입력할 username과 password를 저장할 state 생성
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 페이지 이동을 위한 navigate 함수
  const navigate = useNavigate();

  // '가입하기' 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // form의 기본 동작(페이지 새로고침)을 막음

    try {
      // 백엔드 API에 회원가입 요청 보내기
      await axios.post("http://localhost:5001/api/auth/register", {
        username: username,
        password: password,
      });
      alert("회원가입이 성공적으로 완료되었습니다!");
      navigate("/login"); // 성공 시 로그인 페이지로 이동
    } catch (error) {
      // 에러가 발생했을 때 사용자에게 알려주기
      console.error("회원가입 실패:", error);
      alert(error.response.data.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="form-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>사용자 이름</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
}

export default Register;
