// 변경할 비밀번호를 제출
const submitPassword = async () => {
  const password = document.querySelector('#password').value;
  const authentNum = document.querySelector('#checkPassword').value;

  if (password !== authentNum) {
    alert('패스워드가 일치하지 않습니다.');
    return;
  }
  if (password.length < 4) {
    alert('비밀번호가 너무 짧습니다.');
    return;
  }

  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/auth/reset-password',
      data: { password, authentNum },
    });

    alert(
      '비밀번호 변경이 완료되었습니다. 변경된 비밀번호로 재로그인 부탁드립니다.',
    );
    location.href = '/auth/login';
  } catch (err) {
    getErrorCode(
      err.response.data.statusCode,
      err.response.data.message,
      submitPassword,
    );
  }
};
