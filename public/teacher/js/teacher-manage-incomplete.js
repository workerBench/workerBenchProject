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
        const forFormat = new Date(createdAt);
        const createdDate = `${forFormat.getFullYear()}-${forFormat.getMonth()}-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;

        let buttonHtml = '';
        switch (status) {
          case 'request':
            buttonHtml = `
                        <button type="radio" class="Button" onclick="request(${Id})" id="requestButton">수락 하기</button>
                        <button type="radio" class="Button" onclick="cancleButton(${Id})">취소 하기</button>
                        <button type="radio" class="Button" id="editButton">수정 하기</button>
                         `;
            break;
          case 'non_payment':
            buttonHtml = `
                        <button type="radio" class="Button" onclick="non_payment(${Id})" id="non_paymentButton">결제 대기</button>
                        <button type="radio" class="Button" onclick="cancleButton(${Id})">취소 하기</button>
                        <button type="radio" class="Button" id="editButton">수정 하기</button>
                        `;
            break;
          case 'waiting_lecture':
            buttonHtml = `
                        <button type="radio" class="Button" onclick="waiting_lecture(${Id})" id="completeButton">결제 완료</button>
                        <button type="radio" class="Button" onclick="cancleButton(${Id})">취소 하기</button>
                        <button type="radio" class="Button" id="editButton">수정 하기</button>
                        `;
            break;
        }
        let tempHtml = ``;
        tempHtml += `
                    <div class="teacher-manage-div" >
                       <div class="workshop-information-div">
                            <img src="${workshop_thumb}" alt="" />
                            <li for="purpose-tag" class="workshop-information">타이틀 <br>${workshop_title}</li>
                            <li for="purpose-tag" class="workshop-information">최소 인원 <br>${min_member}명</li>
                            <li for="purpose-tag" class="workshop-information">최대 인원 <br>${max_member}명</li>
                            <li for="purpose-tag" class="workshop-information">분야 <br>${genreTag_name}</li>
                            <li for="purpose-tag" class="workshop-information">걸리는 시간 <br>${total_time}분</li>
                            <li for="purpose-tag" class="workshop-information">가격 <br>${price}원</li>
                    </div>
                    <div class="company-information-div">
                          <div class="company-information">
                              <li for="purpose-tag" class="company-input">설명 <br> ${etc}</li>
                              <li for="purpose-tag" class="company-input">업체명 <br> ${company}</li>
                              <li for="purpose-tag" class="company-input">휴대폰 번호 <br> ${phone_number}</li>
                              <li for="purpose-tag" class="company-input">인원 <br> ${member_cnt}명</li>
                              <li for="purpose-tag" class="company-input">이메일 <br>${email}</li>
                              <li for="purpose-tag" class="company-input">문의한 날짜 <br>${createdDate}</li>
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
function cancleButton(Id) {
  axios({
    method: 'delete',
    url: `/api/teacher/workshops/manage/delete/${Id}`,
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
