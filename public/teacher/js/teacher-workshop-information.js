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
        const company_type = data[i].MyCompany.company_type;
        const company_name = data[i].MyCompany.company_name;
        const business_number = data[i].MyCompany.business_number;
        const bank_name = data[i].MyCompany.bank_name;
        const account = data[i].MyCompany.account;
        const saving_name = data[i].MyCompany.saving_name;
        let tempHtml = ``;
        tempHtml = `
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
            <div class="teacher-workshop-li-div">
              <li class="teacher-workshop-li">업체종류</li>
              <li class="teacher-workshop-li">업체명</li>
              <li class="teacher-workshop-li">사업자 번호</li>
              <li class="teacher-workshop-li">지정은행</li>
              <li class="teacher-workshop-li">계좌 번호</li>
              <li class="teacher-workshop-li">예금주명</li>
            </div>
            <div class="workshop-information-div">
              <li class="workshop-information-li">${company_type}</li>
              <li class="workshop-information-li">${company_name}</li>
              <li class="workshop-information-li">${business_number}</li>
              <li class="workshop-information-li">${bank_name}</li>
              <li class="workshop-information-li">${account}</li>
              <li class="workshop-information-li">${saving_name}</li>
            </div>
          </div>
        </div>
      `;
        workshopInfomationList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      const { data } = response.response;
      alert(data.message);
    });
});

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
