// backend/routes/auth.js

// --- 1. 필요한 도구들 가져오기 ---
import express from "express"; // express 라이브러리
import bcrypt from "bcryptjs"; // 비밀번호 암호화 라이브러리
import User from "../models/User.js"; // 아까 만든 User 모델 (데이터베이스 설계도)
import jwt from "jsonwebtoken";
// --- 2. 라우터 설정 ---
// express의 라우터 기능을 사용하면, 기능별로 코드를 분리해서 관리하기 편해져.
const router = express.Router();

// --- 3. 회원가입 API 만들기 ---
// '/register' 경로로 POST 요청이 들어왔을 때 실행될 코드를 정의
router.post("/register", async (req, res) => {
  // async/await는 비동기(시간이 걸리는 작업) 코드를 쉽게 다루게 해줘.

  // 3-1. 사용자가 보낸 정보 꺼내기
  // req.body에는 사용자가 보낸 데이터(여기서는 username, password)가 들어있어.
  const { username, password } = req.body;

  try {
    // 데이터베이스 작업 중 에러가 발생할 수 있으니 try-catch로 감싸주자.

    // 3-2. 이미 가입된 사용자인지 확인하기
    // User 모델을 사용해 데이터베이스에서 요청된 username과 동일한 사용자가 있는지 찾아봐.
    let user = await User.findOne({ username: username });

    // 만약 user 변수에 값이 있다면, 이미 존재하는 사용자라는 뜻!
    if (user) {
      // 400 상태 코드(클라이언트 요청 오류)와 함께 에러 메시지를 보냄.
      return res
        .status(400)
        .json({ message: "이미 존재하는 사용자 이름입니다." });
    }

    // 3-3. 비밀번호 암호화하기 (⭐️ 아주 중요 ⭐️)
    // 보안을 위해 비밀번호를 절대 그대로 저장하면 안 돼!
    const salt = await bcrypt.genSalt(10); // 암호화를 위한 '소금(salt)' 생성. 10은 보안 강도.
    const hashedPassword = await bcrypt.hash(password, salt); // 원본 비밀번호와 salt를 이용해 암호화.

    // 3-4. 새 사용자 정보 만들기
    // User 모델 설계도에 맞춰 새 사용자 객체를 생성. 비밀번호는 암호화된 걸로!
    user = new User({
      username: username,
      password: hashedPassword,
    });

    // 3-5. 데이터베이스에 저장하기
    await user.save(); // 완성된 사용자 정보를 데이터베이스에 저장.

    // 3-6. 성공 응답 보내기
    // 201 상태 코드(새로운 리소스 생성 성공)와 함께 성공 메시지를 보냄.
    res.status(201).json({ message: "회원가입이 성공적으로 완료되었습니다." });
  } catch (error) {
    // try 블록 안에서 뭔가 에러가 터지면 여기가 실행됨.
    console.error(error); // 어떤 에러인지 터미널에 기록하고,
    res.status(500).send("서버에 문제가 발생했습니다."); // 500 상태 코드(서버 내부 오류)를 보냄.
  }
});
router.post("/login", async (req, res) => {
  // 1. 사용자가 보낸 아이디와 비밀번호 꺼내기
  const { username, password } = req.body;

  try {
    // 2. 데이터베이스에서 해당 아이디를 가진 사용자가 있는지 찾기
    const user = await User.findOne({ username: username });
    // 만약 user가 없다면 (가입되지 않은 아이디라면)
    if (!user) {
      // 400 상태 코드와 함께 에러 메시지를 보냄.
      // 보안을 위해 "아이디가 없습니다" 보다는 "정보가 올바르지 않습니다"처럼 두루뭉술하게 보내는 게 좋아.
      return res
        .status(400)
        .json({ message: "사용자 정보가 올바르지 않습니다." });
    }

    // 3. 비밀번호 비교하기 (⭐️ 핵심 ⭐️)
    // 사용자가 보낸 평문 비밀번호(password)와 DB에 저장된 암호화된 비밀번호(user.password)를 비교
    const isMatch = await bcrypt.compare(password, user.password);
    // 만약 isMatch가 false라면 (비밀번호가 틀렸다면)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "사용자 정보가 올바르지 않습니다." });
    }

    // 4. 비밀번호까지 일치! 이제 디지털 신분증(JWT)을 발급할 차례
    // 토큰에 담을 정보(payload). 여기서는 사용자의 고유 ID만 담을게.
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 5. JWT 토큰 생성
    // jwt.sign(payload, 비밀키, { 옵션 })
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // .env 파일에 저장해둔 우리만의 비밀키
      { expiresIn: "1h" } // 토큰 유효기간: 1시간. (1시간 후에는 자동으로 로그아웃됨)
    );

    // 6. 생성된 토큰을 쿠키에 담아 사용자에게 보내기
    res
      .cookie("token", token, {
        httpOnly: true, // JavaScript 코드로 쿠키에 접근하는 것을 막음 (보안에 중요!)
        maxAge: 60 * 60 * 1000, // 쿠키 유효기간 (1시간). 밀리초 단위.
      })
      .json({
        // 쿠키와 함께 JSON 응답도 보냄
        message: "로그인 성공!",
        user: {
          username: user.username,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버에 문제가 발생했습니다.");
  }
});

// --- 4. 만든 라우터 내보내기 ---
// 이렇게 내보내야 server.js 파일에서 이 라우터를 가져다 쓸 수 있어.
export default router;
