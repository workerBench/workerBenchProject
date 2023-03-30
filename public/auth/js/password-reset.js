// 모달 닫기
const closeModal = () => {
  const modal = document.querySelector('#modal');
  modal.classList.remove('show');
};

// 이메일 입력 후 인증 메일 발송
const sendingEmail = async () => {
  const email = document.querySelector('#email').value;

  if (!email || !email.includes('@') || !email.includes('.')) {
    alert('이메일을 정확히 입력해 주세요');
    return;
  }

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/auth/reset-password',
      data: { email },
    });
    const modal = document.querySelector('#modal');
    modal.classList.add('show');
  } catch (err) {
    alert(`${err.response.data.message}`);
  }
};

// 이메일 인증 코드 입력 후 확인
const checkEmailAuthCode = async () => {
  const email = document.querySelector('#email').value;
  const emailAuthCode = document.querySelector(
    '#Certification-Number-input',
  ).value;

  if (!emailAuthCode) {
    alert('인증 번호를 입력해 주세요.');
    return;
  }

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/auth/reset-password/email-code',
      data: { email, emailAuthCode },
    });

    alert('이메일 인증에 성공하였습니다.');
    location.href = `/auth/password/change`;
  } catch (err) {
    alert(`${err.response.data.message}`);
  }
};
