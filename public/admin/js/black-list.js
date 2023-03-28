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

// 블랙리스트 목록 불러오기
async function getBlackListUser() {
  axios
    .get('../api/admin/ban/users')
    .then(function (response) {
      const users = response.data;
      let html = '';
      for (let user of users) {
        html += `
        <tr>
        <td>${user.email}</td>
        <td>${user.updatedAt.split('T')[0]}</td>
        <td>무성의한 응대</td>
        <td>
            <button class="admin-remove-btn" onclick="unbanUser('${
              user.id
            }')">UnBlack</button>
        </td>
        </tr>
      `;
      }
      $('#user-list-wrap').append(html);
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getBlackListUser();
      }
    });
}

async function getBlackListCompany() {
  axios
    .get('../api/admin/ban/companies')
    .then(function (response) {
      const companys = response.data;
      let html = '';
      for (let company of companys) {
        html += `
        <tr>
        <td>${company.company_name}</td>
        <td>${company.updatedAt.split('T')[0]}</td>
        <td>정산금 지속 연체</td>
        <td>
            <button class="admin-remove-btn" onclick="unbanCompany('${
              company.id
            }')">UnBlack</button>
        </td>
        </tr>
      `;
      }
      $('#company-list-wrap').append(html);
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getBlackListCompany();
      }
    });
}

getBlackListUser();
getBlackListCompany();

// 유저 밴 해제 함수
async function unbanUser(id) {
  try {
    const response = await axios.patch(`/api/admin/unban/user/${id}`);
    alert('해당 유저가 블랙 해제되었습니다.');
    location.reload();
  } catch (error) {
    const result = await getErrorCode(
      error.response.data.statusCode,
      error.response.data.message,
    );
    if (result) {
      unbanUser(id);
    }
  }
}

// 업체 밴 해제 함수
async function unbanCompany(id) {
  try {
    const response = await axios.patch(`/api/admin/unban/company/${id}`);
    alert('해당 업체가 블랙 해제되었습니다.');
    location.reload();
  } catch (error) {
    const result = await getErrorCode(
      error.response.data.statusCode,
      error.response.data.message,
    );
    if (result) {
      unbanCompany(id);
    }
  }
}
