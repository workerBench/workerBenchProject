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
  const registerBtn = document.getElementById('company-registerBtn');
  const input = document.querySelector('#companyName');
  // input.addEventListener('blur', function (event) {
  //   if (this.value.length < 4) {
  //     alert('최소 4자 이상 입력해주세요.');
  //     return;
  //   }
  // });
  registerBtn.addEventListener('click', () => {
    const company_type = document.getElementById('companyType').value;
    const company_name = document.getElementById('companyName').value;
    const business_number = document.getElementById('businessNumber').value;
    const rrn_front = document.getElementById('residentFrontNumber').value;
    const rrn_back = document.getElementById('residentBackNumber').value;
    const bank_name = document.getElementById('bankName').value;
    const account = document.getElementById('accountNumber').value;
    const saving_name = document.getElementById('savingName').value;

    // 입력값 유효성 검사
    if (
      company_type === '' ||
      !company_name ||
      !business_number ||
      !rrn_front ||
      !rrn_back ||
      !bank_name ||
      !account ||
      !saving_name
    ) {
      alert('빈칸없이 입력해주세요');
      return;
    }

    const company_nameRegex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9()&\s+]*$/;
    const company_nameValidationResult = company_nameRegex.test(company_name);

    if (!company_nameValidationResult) {
      alert('업체명은 한글, 영문, 숫자만 입력 가능합니다.');
      return;
    }

    const business_numberRegex = /^[0-9]+$/;
    const business_numberValidationResult =
      business_numberRegex.test(business_number);

    if (!company_nameValidationResult) {
      alert('업체명은 한글, 영문, 숫자만 입력 가능합니다.');
      return;
    }

    if (!business_numberValidationResult || business_number.length !== 10) {
      alert('사업자 번호는 10자리의 숫자만 입력 가능합니다.');
      return;
    }

    if (Number(rrn_back) < 1 || Number(rrn_back) > 4) {
      alert('주민번호 뒷자리(첫 숫자)가 유효하지 않습니다.');
      return;
    }

    const saving_nameRegex = /^[ㄱ-ㅎ가-힣a-zA-Z\s+]*$/;
    const saving_nameValidationResult = saving_nameRegex.test(saving_name);

    if (!saving_nameValidationResult) {
      alert('예금주 명은 한글, 혹은 영문으로만 입력 가능합니다.');
      return;
    }

    axios({
      method: 'post',
      url: '/api/teacher/company',
      data: {
        company_type: parseInt(company_type),
        company_name,
        business_number: parseInt(business_number),
        rrn_front: parseInt(rrn_front),
        rrn_back: parseInt(rrn_back),
        bank_name,
        account: parseInt(account),
        saving_name,
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
          document.getElementById('company-registerBtn').click();
        }
      });
  });
});
