// ⭐️ import 문 상세 주석
// 리액트의 '상태(state)'를 관리하기 위한 useState 훅을 가져옵니다.
import { useState } from "react";
// 백엔드 서버와 HTTP 통신(API 요청)을 하기 위한 axios 라이브러리를 가져옵니다.
import axios from "axios";
// 글 작성 성공 후 다른 페이지로 이동시키기 위한 useNavigate 훅을 가져옵니다.
import { useNavigate } from "react-router-dom";

function Write() {
  // 1. 사용자가 입력할 제목(title)과 내용(content)을 위한 state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // 2. '글 작성' 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 3. 백엔드의 글쓰기 API로 데이터 전송
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/posts`,
        {
          title: title,
          content: content,
        },
        {
          // ⭐️⭐️⭐️ 중요: 이 옵션이 있어야 브라우저가 보관중인 쿠키를 요청에 담아 보냅니다.
          withCredentials: true,
        }
      );
      alert("글이 성공적으로 작성되었습니다!");
      navigate("/"); // 성공 시 홈페이지로 이동
    } catch (error) {
      console.error("글 작성 실패:", error);
      // 만약 인증 오류(401)가 발생하면 로그인 페이지로 보냅니다.
      if (error.response && error.response.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        alert("글 작성 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>글쓰기</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">글 작성</button>
      </form>
    </div>
  );
}

export default Write;
