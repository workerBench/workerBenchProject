document.addEventListener('DOMContentLoaded', () => {
  const workshopInformationList = document.getElementById(
    'workshop-informationList',
  );
  const companyList = document.getElementById('company-List');
  const applyCompanyList = document.getElementById('apply-company-List');

  const companySearch = document.getElementById('search');
  const applyedCompany = document.getElementById('applyedCompany');
  axios({
    method: 'get',
    url: '/api/teacher/mypage',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data.teacher;
      for (let i = 0; i < data.length; i++) {
        const email = data[i].User.email;
        const name = data[i].name;
        const address = data[i].address;
        const phone_number = data[i].phone_number;
        let company_type,
          company_name,
          business_number,
          rrn_front,
          bank_name,
          account,
          saving_name;

        if (data[i].MyCompany) {
          company_type = data[i].MyCompany.company_type;
          company_name = data[i].MyCompany.company_name;
          business_number = data[i].MyCompany.business_number;
          rrn_front = data[i].MyCompany.rrn_front;
          bank_name = data[i].MyCompany.bank_name;
          account = data[i].MyCompany.account;
          saving_name = data[i].MyCompany.saving_name;
        }
        let companyHtml = ``;
        if (!data[i].MyCompany) {
          companyHtml += `
                        <button type="radio" class="Button" onclick="registerCompany()">업체 등록</button>
                        <button type="radio" class="Button" id="applyCompany">업체 신청</button>
                        `;
        } else if (business_number === null) {
          companyHtml += `
          <div class="teacher-workshop-li-div">
              <li class="teacher-workshop-li">업체종류</li>
              <li class="teacher-workshop-li">업체명</li>
          </div>
          <div class="workshop-information-div">
              <li class="workshop-information-li">사업자</li>
              <li class="workshop-information-li">${company_name}</li>
          </div>
`;
        } else if (
          data[i].MyCompany &&
          company_type === 0 &&
          business_number !== null
        ) {
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
                        </div>
                        <div class="applyed-Companys-div">
                            <button type="radio" class="Button" id="applyedCompany" onclick="getCompany()">신청한 업체보기</button>
                        </div>
          `;
        } else if (data[i].MyCompany && company_type === 1) {
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
        } else if (data[i].MyCompany && company_type === 2) {
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
                            <li class="workshop-information-li">간이 사업자</li>
                            <li class="workshop-information-li">${company_name}</li>
                            <li class="workshop-information-li">${business_number}</li>
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
                          <div class="teacher-wrokshop-div">
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
                          <div class="teacher-wrokshop-div">
                              ${companyHtml}
                          </div>;
                      </div>`;
        workshopInformationList.insertAdjacentHTML('beforeend', tempHtml);
      }
      companySearch.addEventListener('click', () => {
        const company_name = document.getElementById('company-name').value;
        axios({
          method: 'get',
          url: `/api/teacher/company/search?company_name=${company_name}`,
          data: {},
        })
          .then((response) => {
            console.log(response);
            const data = response.data;
            for (let i = 0; i < data.length; i++) {
              const company_name = data[i].company_name;
              const saving_name = data[i].saving_name;
              const id = data[i].user_id;

              let tempHtml = ``;
              tempHtml += `
                          <li class="company-information-li">업체 이름 : ${company_name} 이름 :${saving_name} </li>
                          <button type="radio" class="Button" onclick="applyCompany(${id})">업체 신청</button>
                          `;
              companyList.insertAdjacentHTML('beforeend', tempHtml);
            }
          })

          .catch((response) => {
            const { data } = response.response;
            alert(data.error);
          });
      });
    })
    .catch((response) => {
      console.log(response);
      const { data } = response.response;
      alert(data.message);
    });
});
function getCompany() {
  axios({
    method: 'get',
    url: '/api/teacher/company/apply',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      let html = ''; // 누적할 변수 선언
      for (let i = 0; i < data.length; i++) {
        const name = data[i].name;
        const user_id = data[i].user_id;
        html += `
                <li class="company-apply-li"> 이름 :${name} </li>
                <button type="radio" class="applyedCompanyButton" onclick="applyedCompany(${user_id})">업체 신청</button>
                `; // 동적으로 HTML 코드 생성
      }
      document.getElementById('apply-company-List').innerHTML = html; // 생성된 HTML 코드를 apply-company-List 요소에 출력
    })

    .catch((response) => {
      const { data } = response.response;
      alert(data.error);
    });
}
function applyedCompany(user_id) {
  axios({
    method: 'patch',
    url: `/api/teacher/company/register/${user_id}`,
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      alert(data.message);
      location.reload();
    })
    .catch((response) => {
      console.log(response);
      const { data } = response.response;
      alert(data.error);
    });
}
function applyCompany(id) {
  console.log(id);
  axios({
    method: 'post',
    url: `/api/teacher/company/apply/${id}`,
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      alert(data.message);
      location.reload();
    })
    .catch((response) => {
      console.log(response);
      const { data } = response.response;
      alert(data.error);
    });
}
$(document).on('click', '#applyCompany', function (e) {
  console.log('click event');
  $('#modal').addClass('show');
});

// 모달 닫기
$(document).on('click', '#close_btn', function (e) {
  console.log('click event');
  $('#modal').removeClass('show');
});
$(document).on('click', '#applyedCompany', function (e) {
  console.log('click event');
  $('#modal2').addClass('show');
});
$(document).on('click', '#close_btn', function (e) {
  console.log('click event');
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
