document.addEventListener('DOMContentLoaded', () => {
  const workshopIncompleteList = document.getElementById('teacher-manageBox');
  // document.ready(function () {
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
        const status = data[i].workshop_status;
        if (status === 'request') {
        }
        if (status === 'non_payment') {
        }
        if (status === 'waiting_lecture') {
        }

        let tempHtml = ``;
        tempHtml = `
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
                <li for="purpose-tag" class="company-information">${etc}</li>
                <li for="purpose-tag" class="company-information">${company}</li>
                <li for="purpose-tag" class="company-information">${phone_number}</li>
                <li for="purpose-tag" class="company-information">${member_cnt}</li>
                <li for="purpose-tag" class="company-information">${email}</li>
                <li for="purpose-tag" class="company-information">${createdAt}</li>
                <button type="radio" id="button1">수락 하기</button>
                <button type="radio" id="button1">취소 하기</button>
                <button type="radio" id="button2">수정 하기</button>
            </div>
        </div>
      `;
        workshopIncompleteList.insertAdjacentHTML('beforeend', tempHtml);
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
function complete() {
  window.location.href = '/teacher/manage/complete';
}
function incomplete() {
  window.location.href = '/teacher/manage/incomplete';
}
