// 로그인 화면으로 가기
const login = () => {
  location.href = '/auth/login';
};

// 회원가입 화면으로 가기
const register = () => {
  location.href = '/auth/signup';
};

// 마이 페이지로 가기
const goMypage = () => {
  location.href = '/mypage/workshops';
};

// 로그아웃 하기
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/logout/user',
    });
    location.href = '/';
    //location.reload();
  } catch (err) {}
};
