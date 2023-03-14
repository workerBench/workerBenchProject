const login = async () => {
  const email = document.querySelector('#inputEmail').value;
  const password = document.querySelector('#inputPassword').value;

  if (!email || !email.includes('@') || !email.includes('.')) {
    alert('이메일을 정확히 입력해 주세요');
    return;
  }
  if (!password) {
    alert('비밀번호를 입력해 주세요');
    return;
  }

  try {
    const res2 = await axios({
      method: 'POST',
      url: '/api/auth/login/admin',
      data: { email, password },
    });
    location.href = '/admin/workshops-request';
  } catch (err) {
    alert(
      `에러 코드: ${err.response.data.statusCode} / message: ${err.response.data.message}`,
    );
  }
};
