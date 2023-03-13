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
      console.log(response);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const email = data[i].User.email;
        console.log(email);
        const name = data[i].name;
        const address = data[i].address;
        const phone_number = data[i].phone_number;
        const company_type = data[i].MyCompany.company_type;
        console.log(company_type);
        const company_name = data[i].MyCompany.company_name;
        const business_number = data[i].MyCompany.business_number;
        const bank_name = data[i].MyCompany.bank_name;
        const account = data[i].MyCompany.account;
        const saving_name = data[i].MyCompany.saving_name;
        let tempHtml = ``;
        tempHtml = `
        <div class="workshop-div1">
        <li class="wating-workshop">강사 정보</li>
        <div class="wating-workshop-div">
          <li class="wating-workshop">${email}email</li>
          <li class="wating-workshop">${name}이름</li>
          <li class="wating-workshop">${address}주소</li>
          <li class="wating-workshop">${phone_number}전화번호</li>
        </div>
      </div>
      <div class="workshop-div1">
        <li class="wating-workshop">강사 정보</li>
        <div class="wating-workshop-div">
          <li class="wating-workshop">${company_type}업체 종류</li>
          <li class="wating-workshop">${company_name}업체명</li>
          <li class="wating-workshop">${business_number}사업자 번호</li>
          <li class="wating-workshop">${bank_name}지정은행</li>
          <li class="wating-workshop">${account}계좌 번호</li>
          <li class="wating-workshop">${saving_name}예금주 명</li>
        </div>
      </div>
      `;
        workshopInfomationList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      console.log(response);
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
