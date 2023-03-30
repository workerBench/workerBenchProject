// access 토큰이 만료되었을 시 refresh 토큰으로 access 토큰 재발급을 요청
const requestAccessToken = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/refreshtoken/user',
    });
    return true;
  } catch (err) {
    return false;
  }
};

// 에러 발생 시 상태 코드에 따른 로직 실행
const getErrorCode = async (statusCode, errorMessage) => {
  if (statusCode === 400) {
    alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
    return false;
  }
  if (statusCode === 401) {
    const refreshRes = await requestAccessToken();
    if (!refreshRes) {
      alert('현재 로그인이 되어있지 않습니다. 로그인 후 이용 가능합니다.');
      location.href = '/auth/login';
      return;
    }
    return true;
  }
  alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
  return false;
};

document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn');
  registerBtn.addEventListener('click', () => {
    const phone_number = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const name = document.getElementById('name').value;

    // 입력값 유효성 검사
    const addressRegex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s+]*$/;
    const addressValidationResult = addressRegex.test(address);

    const nameRegex = /^[ㄱ-ㅎ가-힣a-zA-Z\s+]*$/;
    const nameValidationResult = nameRegex.test(name);

    if (!addressValidationResult || !nameValidationResult) {
      console.log('주소와 이름에 특수문자는 포함될 수 없습니다.');
      return;
    }

    axios({
      method: 'post',
      url: '/api/teacher',
      data: {
        phone_number,
        address,
        name,
      },
    })
      .then((response) => {
        const data = response.data;
        alert(data.message);
        window.location.href = '/teacher/workshop';
      })
      .catch(async (error) => {
        const result = await getErrorCode(
          error.response.data.statusCode,
          error.response.data.message,
        );
        if (result) {
          document.getElementById('registerBtn').click();
        }
      });
  });
});
