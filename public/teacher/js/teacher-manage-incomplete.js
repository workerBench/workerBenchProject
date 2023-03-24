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
      const data = response.data.non_complete_instance_list;
      for (let i = 0; i < data.length; i++) {
        const workshop_thumb = data[i].workshop_thumb;
        const workshop_title = data[i].workshop_title;
        const min_member = data[i].workshop_min_member;
        const max_member = data[i].workshop_max_member;
        const genreTag_name = data[i].genreTag_name;
        const purposeTag_name = data[i].purposeTag_name;
        const total_time = data[i].workshop_total_time;
        let hours = Math.floor(total_time / 60); // 60으로 나눈 몫을 구합니다
        let remainingMinutes = total_time % 60; // 60으로 나눈 나머지를 구합니다
        const price = data[i].workshop_price;
        const etc = data[i].workShopInstanceDetail_etc;
        const company = data[i].workShopInstanceDetail_company;
        const phone_number = data[i].workShopInstanceDetail_phone_number;
        const member_cnt = data[i].workShopInstanceDetail_member_cnt;
        const email = data[i].workShopInstanceDetail_email;
        const createdAt = data[i].workShopInstanceDetail_createdAt;
        const status = data[i].workShopInstanceDetail_status;
        const Id = data[i].workShopInstanceDetail_id;
        const forFormat = new Date(createdAt);
        const createdDate = `${forFormat.getFullYear()}-${forFormat.getMonth()}-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;

        let buttonHtml = '';
        switch (status) {
          case 'request':
            buttonHtml = `
                        <button type="radio" class="Button" onclick="rejectButton(${Id})">취소 하기</button>
                        <button type="radio" class="Button" onclick="request(${Id})" id="requestButton">수락 하기</button>
                         `;
            break;
          case 'non_payment':
            buttonHtml = `
                        <div class="non_payment-Button" onclick="non_payment(${Id})" id="non_paymentButton">결제 대기중</div>
                        `;
            break;
          case 'waiting_lecture':
            buttonHtml = `
                        <button type="radio" class="Button" onclick="waiting_lecture(${Id})" id="completeButton">결제 완료</button>
                        `;
            break;
        }

        let tempHtml = ``;
        tempHtml += `
                    <div class="teacher-manage-div" >
                    <div class="workshop-information-div">
                        <img src="${workshop_thumb}" alt="" />
                        <li for="purpose-tag" class="workshop-information-title"><img src="/images/title1.png" width="40" />${workshop_title}</li>
                        <li for="purpose-tag" class="workshop-information">최소 인원 : ${min_member}명</li>
                        <li for="purpose-tag" class="workshop-information">최대 인원 : ${max_member}명</li>
                        <li for="purpose-tag" class="workshop-information">분야<img src="/images/tag3.png" width="40" /> ${genreTag_name}<br> 목적<img src="/images/tag4.png" width="40" /> ${purposeTag_name}</li>
                        <li for="purpose-tag" class="workshop-information"><img src="/images/time.png" width="40" /> ${hours}시간 ${remainingMinutes}분</li>
                        <li for="purpose-tag" class="workshop-information-price"><img src="/images/money.png" width="50" /> ${price}원</li>
                    </div>
                    <div class="company-information-div">
                        <div class="company-information">
                            <li for="purpose-tag" class="company-input-desc"><img src="/images/list.png" width="50" />${etc}</li>
                            <li for="purpose-tag" class="company-input"><img src="/images/office-building.png" width="50" />${company}</li>
                            <li for="purpose-tag" class="company-input"><img src="/images/smartphone.png" width="50" /> ${phone_number}</li>
                            <li for="purpose-tag" class="company-input"><img src="/images/group.png" width="50" /> ${member_cnt}명</li>
                            <li for="purpose-tag" class="company-input"><img src="/images/email2.png" width="50" /> ${email}</li>
                            <li for="purpose-tag" class="company-input"><img src="/images/calendar.png" width="50" /> ${createdDate}</li>
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
function rejectButton(Id) {
  axios({
    method: 'patch',
    url: `/api/teacher/workshops/manage/reject/${Id}`,
    data: {},
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
