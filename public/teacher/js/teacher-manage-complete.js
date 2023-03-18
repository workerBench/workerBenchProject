document.addEventListener('DOMContentLoaded', () => {
  const workshopcompleteList = document.getElementById('teacher-completeBox');
  axios({
    method: 'get',
    url: '/api/teacher/workshops/complete',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data.complete_instance_list;
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
        const id = data[i].workshop_id;
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
                <div class="company-information">
                    <li for="purpose-tag" class="company-input">${etc}</li>
                    <li for="purpose-tag" class="company-input">${company}</li>
                    <li for="purpose-tag" class="company-input">${phone_number}</li>
                    <li for="purpose-tag" class="company-input">${member_cnt}</li>
                    <li for="purpose-tag" class="company-input">${email}</li>
                    <li for="purpose-tag" class="company-input">${createdAt}</li>
                </div>
                <div id = button-div>
                <button type="radio" class="Button" id="completeButton">수강 완료</button>
                <button type="radio" class="Button" id="rejectButton">취소 하기</button>
                <button type="radio" class="Button" id="editButton">수정 하기</button>
            </div>
        </div>
    </div>
  `;
        workshopcompleteList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      console.log(response);
      const { data } = response.response;
      alert(data.error);
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
