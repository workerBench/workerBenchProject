document.addEventListener('DOMContentLoaded', () => {
  const workshopIncompleteList = document.getElementById('teacher-manageBox');
  // document.ready(function () {
  axios({
    method: 'get',
    url: '/api/teacher/workshops/request',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const title = data[i].title;
        const min_member = data[i].min_member;
        const max_member = data[i].max_member;
        const genre_id = data[i].genre_id;
        const total_time = data[i].total_time;
        const price = data[i].price;
        const desc = data[i].desc;
        // const price = data[i].price;
        // const price = data[i].price;
        // const price = data[i].price;
        // const price = data[i].price;
        const createdAt = data[i].createdAt;
        let tempHtml = ``;

        tempHtml = `
        <div class="teacher-manage-div" >
            <div class="workshop-information-div">
                <img src="/images/images.jpg" alt="" />
                <li for="purpose-tag" class="workshop-information">${title}</li>
                <li for="purpose-tag" class="workshop-information">${min_member}</li>
                <li for="purpose-tag" class="workshop-information">${max_member}</li>
                <li for="purpose-tag" class="workshop-information">${genre_id}</li>
                <li for="purpose-tag" class="workshop-information">${total_time}</li>
                <li for="purpose-tag" class="workshop-information">${price}</li>
            </div>
            <div class="company-information-div">
                <li for="purpose-tag" class="company-information">${desc}</li>
                <li for="purpose-tag" class="company-information">회사</li>
                <li for="purpose-tag" class="company-information">전화번호</li>
                <li for="purpose-tag" class="company-information">인원</li>
                <li for="purpose-tag" class="company-information">이메일</li>
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
