// 모달 닫기
const closeModal = () => {
  const modal = document.querySelector('#modal');
  modal.classList.remove('show');
};

// 가입하기 버튼 클릭 시 유효성 검사 및 이메일 인증 코드 발송
const checkRegisterInfo = async () => {
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const authentNum = document.querySelector('#checkPassword').value;

  if (!email || !email.includes('@') || !email.includes('.')) {
    alert('이메일을 정확히 입력해 주세요');
    return;
  }
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
      method: 'POST',
      url: '/api/auth/register',
      data: { email, password, authentNum },
    });
    const modal = document.querySelector('#modal');
    modal.classList.add('show');
  } catch (err) {
    // console.log(err.response.data);   // 서버 측 글로벌 에러 필터에서 리턴한 값이 여기에 담겨 있어.
    alert(
      `에러 코드: ${err.response.data.statusCode} / message: ${err.response.data.message}`,
    );
  }
};

// 이메일 인증 코드 입력 후 서버로 전송. 성공 시 회원가입 완료
const checkCode = async () => {
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const emailAuthCode = document.querySelector(
    '#Certification-Number-input',
  ).value;

  if (!emailAuthCode) {
    alert('이메일 인증 코드를 입력해 주세요!');
    return;
  }

  try {
    const res2 = await axios({
      method: 'POST',
      url: '/api/auth/register/join',
      data: { email, password, emailAuthCode },
    });
    location.href = '/';
  } catch (err) {
    alert(
      `에러 코드: ${err.response.data.statusCode} / message: ${err.response.data.message}`,
    );
  }
};
