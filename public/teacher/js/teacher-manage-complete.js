document.addEventListener('DOMContentLoaded', () => {
  const teacherWorkshopList = document.getElementById('teacher-workshopInfo');
  const teacherCompanyList = document.getElementById('teacher-companyInfo');
  // document.ready(function () {
  axios({
    method: 'get',
    url: '/api/teacher/workshops/complete',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const title = data[i].title;
        const min_member = data[i].workshop_min_member;
        const max_member = data[i].workshop_max_member;
        const genre_id = data[i].genre_id;
        const total_time = data[i].total_time;
        const price = data[i].price;
        const desc = data[i].desc;
        const company = data[i].company;
        const phone_number = data[i].phone_number;
        const member_cnt = data[i].member_cnt;
        const email = data[i].email;
        const createdAt = data[i].createdAt;
        let tempHtml = ``;

        tempHtml = `
         
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
                  <li for="purpose-tag" class="company-information">${company}</li>
                  <li for="purpose-tag" class="company-information">${phone_number}</li>
                  <li for="purpose-tag" class="company-information">${member_cnt}</li>
                  <li for="purpose-tag" class="company-information">${email}</li>
                  <li for="purpose-tag" class="company-information">${createdAt}</li>
                  <button type="radio" id="button1">수락 하기</button>
                  <button type="radio" id="button1">취소 하기</button>
                  <button type="radio" id="button2">수정 하기</button>
              </div>
        `;
        teacherWorkshopList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      console.log(response);
    });
  axios({
    method: 'get',
    url: '/api/teacher/workshops/complete',
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const title = data[i].workshop_title;
        const min_member = data[i].workshop_thumb;
        const max_member = data[i].max_member;
        const genre_id = data[i].genre_id;
        const total_time = data[i].total_time;
        const price = data[i].price;
        const desc = data[i].desc;
        const company = data[i].company;
        const phone_number = data[i].phone_number;
        const member_cnt = data[i].member_cnt;
        const email = data[i].email;
        const createdAt = data[i].createdAt;
        let tempHtml = ``;
        tempHtml = `
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
                  <li for="purpose-tag" class="company-information">${company}</li>
                  <li for="purpose-tag" class="company-information">${phone_number}</li>
                  <li for="purpose-tag" class="company-information">${member_cnt}</li>
                  <li for="purpose-tag" class="company-information">${email}</li>
                  <li for="purpose-tag" class="company-information">${createdAt}</li>
                  <button type="radio" id="button1">수락 하기</button>
                  <button type="radio" id="button1">취소 하기</button>
                  <button type="radio" id="button2">수정 하기</button>
              </div>
        `;
        teacherWorkshopList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      console.log(response);
    });
  axios({
    method: 'get',
    url: '/api/teacher/workshops/complete',
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
        const company = data[i].company;
        const phone_number = data[i].phone_number;
        const member_cnt = data[i].member_cnt;
        const email = data[i].email;
        const createdAt = data[i].createdAt;
        let tempHtml = ``;

        tempHtml = `
           
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
                    <li for="purpose-tag" class="company-information">${company}</li>
                    <li for="purpose-tag" class="company-information">${phone_number}</li>
                    <li for="purpose-tag" class="company-information">${member_cnt}</li>
                    <li for="purpose-tag" class="company-information">${email}</li>
                    <li for="purpose-tag" class="company-information">${createdAt}</li>
                    <button type="radio" id="button1">수락 하기</button>
                    <button type="radio" id="button1">취소 하기</button>
                    <button type="radio" id="button2">수정 하기</button>
                </div>
          `;
        teacherWorkshopList.insertAdjacentHTML('beforeend', tempHtml);
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
