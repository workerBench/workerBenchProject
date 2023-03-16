document.addEventListener('DOMContentLoaded', () => {
  const workshopInfomationList = document.getElementById(
    'workshop-infomationList',
  );
  axios({
    method: 'get',
    url: '/api/teacher/mypage',
    data: {},
  })
    .then((response) => {
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const email = data[i].User.email;
        const name = data[i].name;
        const address = data[i].address;
        const phone_number = data[i].phone_number;
        let company_type,
          company_name,
          business_number,
          rrn_front,
          rrn_back,
          bank_name,
          account,
          saving_name;

        if (data[i].MyCompany) {
          company_type = data[i].MyCompany.company_type;
          company_name = data[i].MyCompany.company_name;
          business_number = data[i].MyCompany.business_number;
          rrn_front = data[i].MyCompany.rrn_front;
          rrn_back = data[i].MyCompany.rrn_back;
          bank_name = data[i].MyCompany.bank_name;
          account = data[i].MyCompany.account;
          saving_name = data[i].MyCompany.saving_name;
        }
        let companyHtml = ``;
        if (!data[i].MyCompany) {
          companyHtml += `
                        <button type="radio" class="Button" onclick="registerCompany()">업체 등록</button>
                        `;
        } else if (data[i].MyCompany && company_type === 0) {
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
          `;
        } else if (data[i].MyCompany && company_type === 1) {
          companyHtml += `
                        <div class="teacher-workshop-li-div">
                            <li class="teacher-workshop-li">업체종류</li>
                            <li class="teacher-workshop-li">업체명</li>
                            <li class="teacher-workshop-li">주빈번호 앞자리</li>
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
        workshopInfomationList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      console.log(response);
      const { data } = response.response;
      alert(data.message);
    });
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
