// 로그아웃 하기
const adminLogout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/logout/admin',
    });
    location.href = '/admin/login';
    //location.reload();
  } catch (err) {}
};
