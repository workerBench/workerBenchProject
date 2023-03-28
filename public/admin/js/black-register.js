// access 토큰이 만료되었을 시 refresh 토큰으로 access 토큰 재발급을 요청
const requestAccessToken = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/refreshtoken/admin',
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
      location.href = '/admin/login';
      return;
    }
    return true;
  }
};

$(document).ready(() => {
  $('.search-button').on('click', async () => {
    const searchField = $('.form-select').val() === '1' ? 'email' : 'company';
    const searchText = $('.search-box').val();
    try {
      const params = new URLSearchParams();
      params.append(searchField, searchText);
      const { data } = await axios.get('/api/admin/search/members', {
        params: params,
      });

      // 기존의 결과를 모두 지웁니다.
      $('.user-list-wrap').empty();
      $('.company-list-wrap').empty();

      // 검색 결과를 동적으로 추가합니다.
      if (searchField === 'email') {
        data.forEach((user) => {
          const userHtml = `
              <div class="user-wrap">
                <div class="user-data">${user.email}</div>
                <div class="ban-btn" onclick="banUser('${user.id}')">Black</div>
              </div>
            `;
          $('.user-list-wrap').append(userHtml);
        });
      }
      if (searchField === 'company') {
        data.forEach((company) => {
          const companyHtml = `
              <div class="company-wrap">
                <div class="company-data">${company.company_name}</div>
                <div class="ban-btn" onclick="banCompany('${company.id}')">Black</div>
              </div>
            `;
          $('.company-list-wrap').append(companyHtml);
        });
      }
    } catch (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        document.querySelector('.search-button').click();
      }
    }
  });
});

// 사용자 밴 처리 함수
async function banUser(id) {
  try {
    const response = await axios.patch(`/api/admin/ban/user/${id}`);
    alert('해당 유저가 블랙 처리되었습니다.');
    location.reload();
  } catch (error) {
    const result = await getErrorCode(
      error.response.data.statusCode,
      error.response.data.message,
    );
    if (result) {
      banUser(id);
    }
  }
}

// 업체 밴 처리 함수
async function banCompany(id) {
  try {
    const response = await axios.patch(`/api/admin/ban/company/${id}`);
    alert('해당 업체가 블랙 처리되었습니다.');
    location.reload();
  } catch (error) {
    const result = await getErrorCode(
      error.response.data.statusCode,
      error.response.data.message,
    );
    if (result) {
      banCompany(id);
    }
  }
}
