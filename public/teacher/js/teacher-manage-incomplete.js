document.addEventListener('DOMContentLoaded', () => {
  const workshopincompleteList = document.getElementById(
    'teacher-incompleteBox',
  );
  axios({
    method: 'get',
    url: '/api/teacher/workshops/incomplete',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const workshop_thumb = data[i].workshop_thumb;
        const workshop_title = data[i].workshop_title;
        const min_member = data[i].workshop_min_member;
        const max_member = data[i].workshop_max_member;
        const genreTag_name = data[i].genreTag_name;
        const total_time = data[i].workshop_total_time;
        const price = data[i].workshop_price;
        const etc = data[i].workShopInstanceDetail_etc;
        const company = data[i].workShopInstanceDetail_company;
        const phone_number = data[i].workShopInstanceDetail_phone_number;
        const member_cnt = data[i].workShopInstanceDetail_member_cnt;
        const email = data[i].workShopInstanceDetail_email;
        const createdAt = data[i].workShopInstanceDetail_createdAt;
        const status = data[i].workShopInstanceDetail_status;
        const Id = data[i].workShopInstanceDetail_id;

        let buttonHtml = '';
        switch (status) {
          case 'request':
            buttonHtml = `
                <button type="radio" class="Button" onclick="request(${Id})" id="requestButton">수락 하기</button>
                <button type="radio" class="Button" id="rejectButton">취소 하기</button>
                <button type="radio" class="Button" id="editButton">수정 하기</button>
            `;
            break;
          case 'non_payment':
            buttonHtml = `
                <button type="radio" class="Button" onclick="non_payment(${Id})" id="non_paymentButton">결제 대기</button>
                <button type="radio" class="Button" id="rejectButton">취소 하기</button>
                <button type="radio" class="Button" id="editButton">수정 하기</button>
            `;
            break;
          case 'waiting_lecture':
            buttonHtml = `
                <button type="radio" class="Button" onclick="waiting_lecture(${Id})" id="completeButton">결제 완료</button>
                <button type="radio" class="Button" id="rejectButton">취소 하기</button>
                <button type="radio" class="Button" id="editButton">수정 하기</button>
            `;
            break;
        }
        let tempHtml = ``;
        tempHtml += `
        <div class="teacher-manage-div" >
            <div class="workshop-information-div">
                <img src="/images/images.jpg" alt="" />
                <li for="purpose-tag" class="workshop-information">${workshop_thumb}</li>
                <li for="purpose-tag" class="workshop-information">${workshop_title}</li>
                <li for="purpose-tag" class="workshop-information">${min_member}</li>
                <li for="purpose-tag" class="workshop-information">${max_member}</li>
                <li for="purpose-tag" class="workshop-information">${genreTag_name}</li>
                <li for="purpose-tag" class="workshop-information">${total_time}</li>
                <li for="purpose-tag" class="workshop-information">${price}</li>
            </div>
            <div class="company-information-div">
                <div class="company-information">
                    <li for="purpose-tag" class="company-input">${etc}</li>
                    <li for="purpose-tag" class="company-input">${company}</li>
                    <li for="purpose-tag" class="company-input">${phone_number}</li>
                    <li for="purpose-tag" class="company-input">${member_cnt}</li>
                    <li for="purpose-tag" class="company-input">${email}</li>
                    <li for="purpose-tag" class="company-input">${createdAt}</li>
                </div>
                <div id = button-div>
                     ${buttonHtml}
                </div>
            </div>
        </div>
`;
        workshopincompleteList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      console.log(response);
      const { data } = response.response;
      alert(data.error);
    });
});
function request(Id, status) {
  axios({
    method: 'patch',
    url: `/api/teacher/workshops/manage/accept/${Id}`,
    data: {
      status,
    },
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
      window.location.reload();
    })
    .catch((response) => {
      const { data } = response.response;
      alert(data.error);
    });
}
function waiting_lecture(Id, status) {
  axios({
    method: 'patch',
    url: `/api/teacher/workshops/manage/complete/${Id}`,
    data: {
      status,
    },
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
      window.location.reload();
    })
    .catch((response) => {
      const { data } = response.response;
      alert(data.error);
    });
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
function complete() {
  window.location.href = '/teacher/manage/complete';
}
function incomplete() {
  window.location.href = '/teacher/manage/incomplete';
}
