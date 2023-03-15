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
    // location.reload();
    location.href = '/';
  } catch (err) {}
};
