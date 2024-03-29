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

const getTeacherMypage = () => {
  const workshopInformationList = document.getElementById(
    'workshop-informationList',
  );
  const companyList = document.getElementById('company-List');
  const companySearch = document.getElementById('search');
  axios({
    method: 'get',
    url: '/api/teacher/mypage',
    data: {},
  })
    .then((response) => {
      const data = response.data.teacher;
      const email = data.User.email;
      const name = data.name;
      const address = data.address;
      const phone_number = data.phone_number;
      let company_type,
        company_name,
        business_number,
        rrn_front,
        bank_name,
        account,
        saving_name;
      if (data.MyCompany) {
        company_type = data.MyCompany.company_type;
        company_name = data.MyCompany.company_name;
        business_number = data.MyCompany.business_number;
        rrn_front = data.MyCompany.rrn_front;
        bank_name = data.MyCompany.bank_name;
        account = data.MyCompany.account;
        saving_name = data.MyCompany.saving_name;
      }
      if (data.company) {
        company_type = data.company.company_type;
        company_name = data.company.company_name;
        business_number = data.company.business_number;
        rrn_front = data.company.rrn_front;
        bank_name = data.company.bank_name;
        account = data.company.account;
        saving_name = data.company.saving_name;
      }
      let companyHtml = ``;
      if (!data.MyCompany && !data.company) {
        companyHtml += `
                              <button type="radio" class="Button" onclick="registerCompany()">업체 등록</button>
                              <button type="radio" class="Button" id="applyCompany">업체 가입 신청</button>
                              `;
      } else if (!data.MyCompany && data.company) {
        company_name = data.company.company_name;
        saving_name = data.company.saving_name;
        companyHtml += `
                <div class="teacher-workshop-li-div">
                    <li class="teacher-workshop-li">업체종류</li>
                    <li class="teacher-workshop-li">업체명</li>
                </div>
                <div class="workshop-information-div">
                    <li class="workshop-information-li">${
                      company_type === 0 ? '사업자' : '프리랜서'
                    }</li>
                    <li class="workshop-information-li">${company_name}</li>
                </div>
      `;
      } else if (data.MyCompany && company_type === 0) {
        companyHtml += `
                              <div class="teacher-workshop-li-div">
                                  <li class="teacher-workshop-li">업체종류</li>
                                  <li class="teacher-workshop-li">업체명</li>
                                  <li class="teacher-workshop-li">사업자 번호</li>
                                  <li class="teacher-workshop-li">지정은행</li>
                                  <li class="teacher-workshop-li">계좌 번호</li>
                                  <li class="teacher-workshop-li">예금주명</li>
                              </div>
                              <div class="workshop-information-div">
                                  <li class="workshop-information-li">사업자</li>
                                  <li class="workshop-information-li">${company_name}</li>
                                  <li class="workshop-information-li">${business_number}</li>
                                  <li class="workshop-information-li">${bank_name}</li>
                                  <li class="workshop-information-li">${account}</li>
                                  <li class="workshop-information-li">${saving_name}</li>
                                  <button type="radio"  id="acceptListCompanyButton" onclick="acceptListCompany()">신청 목록 보기</button>
                              </div>
                `;
      } else if (data.MyCompany && company_type === 1) {
        companyHtml += `
                              <div class="teacher-workshop-li-div">
                                  <li class="teacher-workshop-li">업체종류</li>
                                  <li class="teacher-workshop-li">업체명</li>
                                  <li class="teacher-workshop-li">주빈번호 앞자리</li>
                                  <li class="teacher-workshop-li">지정은행</li>
                                  <li class="teacher-workshop-li">계좌 번호</li>
                                  <li class="teacher-workshop-li">예금주명</li>
                              </div>
                              <div class="workshop-information-div">
                                  <li class="workshop-information-li">프리랜서</li>
                                  <li class="workshop-information-li">${company_name}</li>
                                  <li class="workshop-information-li">${rrn_front}</li>
                                  <li class="workshop-information-li">${bank_name}</li>
                                  <li class="workshop-information-li">${account}</li>
                                  <li class="workshop-information-li">${saving_name}</li>
                              </div>
                `;
      }
      let tempHtml = ``;
      tempHtml += `
                      <div class="workshop-div">
                          <div class="teacher-li-div">
                              <li class="teacher-li">강사 정보</li>
                          </div>
                          <div class="teacher-workshop-div">
                              <div class="teacher-workshop-li-div">
                                  <li class="teacher-workshop-li">email</li>
                                  <li class="teacher-workshop-li">이름</li>
                                  <li class="teacher-workshop-li">주소</li>
                                  <li class="teacher-workshop-li">전화번호</li>
                              </div>
                              <div class="workshop-information-div">
                                  <li class="workshop-information-li">${email}</li>
                                  <li class="workshop-information-li">${name}</li>
                                  <li class="workshop-information-li">${address}</li>
                                  <li class="workshop-information-li">${phone_number}</li>
                              </div>
                          </div>
                      </div>
                      <div class="workshop-div">
                          <div class="teacher-li-div">
                              <li class="teacher-li">업체 정보</li>  
                          </div>
                          <div class="teacher-workshop-div">
                              ${companyHtml}
                          </div>;
                      </div>
                      `;
      workshopInformationList.insertAdjacentHTML('beforeend', tempHtml);
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getTeacherMypage();
      }
    });
};

const searchingCompany = () => {
  // 등록된 업체 검색
  const companySearch = document.getElementById('search');
  companySearch.addEventListener('click', () => {
    const company_name = document.getElementById('company-name').value;
    // if (!company_name) {
    //   alert('업체를 입력해 주세요');
    //   return;
    // }
    axios({
      method: 'get',
      url: `/api/teacher/company/search?company_name=${company_name}`,
      data: {},
    })
      .then((response) => {
        const data = response.data;
        const applyCompanyTable = document.getElementById('company');
        applyCompanyTable.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
          const company_name = data[i].company_name;
          const saving_name = data[i].saving_name;
          const id = data[i].user_id;
          const createdAt = data[i].createdAt;
          let tempHtml = ``;
          tempHtml += `
          <tr>
            <td>${company_name}</td>
            <td>${saving_name}</td>
            <td>${createdAt.split('T')[0]}</td>
            <td>
            <button class="apply-btn" onclick="applyCompany(${id})">가입 신청</button>
            </td>
          </tr>
          `;
          applyCompanyTable.insertAdjacentHTML('beforeend', tempHtml);
        }
        // location.reload();
      })
      .catch(async (error) => {
        const result = await getErrorCode(
          error.response.data.statusCode,
          error.response.data.message,
        );
        if (result) {
          document.getElementById('search').click();
        }
      });
  });
};

const getEveryCompany = () => {
  // 모든 업체 목록 조회
  axios
    .get('/api/teacher/companies')
    .then(function (response) {
      const companies = response.data;
      let html = '';
      for (let company of companies) {
        html += `
        <tr>
            <td>${company.company_name}</td>
            <td>${company.saving_name}</td>
            <td>${company.createdAt.split('T')[0]}</td>
            <td>
              <button class="apply-btn" onclick="applyCompany(${
                company.user_id
              })">가입 신청</button>
            </td>
          </tr>
        `;
      }
      $('#company').append(html);
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getEveryCompany();
      }
    });
};

document.addEventListener('DOMContentLoaded', () => {
  getTeacherMypage();
  searchingCompany();
  getEveryCompany();
});

// 등록된 업체에 등록 신청
function applyCompany(id) {
  axios({
    method: 'post',
    url: `/api/teacher/company/apply/${id}`,
    data: {},
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
      location.reload();
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        applyCompany(id);
      }
    });
}
// 업체 소속을 신청한 강사 목록 보기
function acceptListCompany() {
  axios({
    method: 'get',
    url: '/api/teacher/company/apply',
    data: {},
  })
    .then((response) => {
      const data = response.data;
      let html = '';
      for (let i = 0; i < data.length; i++) {
        const name = data[i].name;
        const user_id = data[i].user_id;
        const phone_number = data[i].phone_number;
        html += `
                
        <tr>
          <td>${name}</td>
          <td>${phone_number}</td>
          <td>
            <button class="manage-btn" onclick="acceptCompany(${user_id})">수락</button>
            <button class="manage-btn" onclick="cancleCompany(${user_id})">반려</button>
          </td>
        </tr> 
     `;
      }
      document.getElementById('apply-company').innerHTML = html;
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        acceptListCompany();
      }
    });
}

// 업체 소속을 신청한 업체 수락하기
function acceptCompany(user_id) {
  axios({
    method: 'patch',
    url: `/api/teacher/company/accept/${user_id}`,
    data: {},
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
      location.reload();
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        acceptCompany(user_id);
      }
    });
}

// 업체 소속을 신청한 업체 반려하기
function cancleCompany(user_id) {
  axios({
    method: 'delete',
    url: `/api/teacher/company/cancle/${user_id}`,
    data: {},
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
      location.reload();
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        cancleCompany(user_id);
      }
    });
}

// 등록된 업체에 등록신청 모달 열기
$(document).on('click', '#applyCompany', function (e) {
  $('#modal').addClass('show');
});
// 모달 닫기
$(document).on('click', '#close_btn', function (e) {
  $('#modal').removeClass('show');
});
// 업체 소속을 신청한 업체 목록 보기 모달 열기
$(document).on('click', '#acceptListCompanyButton', function (e) {
  $('#modal2').addClass('show');
});
// 모달 닫기
$(document).on('click', '#close_btn', function (e) {
  $('#modal2').removeClass('show');
});
function registerCompany() {
  window.location.href = '/teacher/company/register';
}
function workshop() {
  window.location.href = '/teacher/workshop';
}
function information() {
  window.location.href = '/teacher/workshop/information';
}
function register() {
  window.location.href = '/teacher/workshop/register';
}
function manage() {
  window.location.href = '/teacher/manage/complete';
}
