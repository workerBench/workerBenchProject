// 로그인 시도
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
      url: '/api/auth/login/user',
      data: { email, password },
    });
    // location.href = '/';
    const beforeUrl = document.referrer; // 이전에 유입된 주소.
    if (beforeUrl.includes('password/change')) {
      location.href = '/';
    } else {
      location.href = beforeUrl;
    }
  } catch (err) {
    alert(`${err.response.data.message}`);
  }
};
