document.addEventListener('DOMContentLoaded', () => {
  const wokshopApprovalList = document.getElementById('wokshop-approvalList');
  const wokshopFinishedList = document.getElementById('wokshop-finishedList');
  const wokshopRequestList = document.getElementById('wokshop-requestList');
  // document.ready(function () {
  axios({
    method: 'get',
    url: '/api/teacher/workshops',
    data: {},
  })
    .then((response) => {
      console.log(response);

      const data = response.data;
      for (let i = 0; i < data.length; i++) {
        const thumb = data[i].workshop_thumb;
        const title = data[i].workshop_title;
        const genreTag = data[i].genreTag_name;
        const purposeTag = data[i].purposeTag_name;
        const status = data[i].workshop_status;
        let tempHtml = ``;
        console.log(status);
        if (status === 'approval') {
          tempHtml = `<div class="workshop">
            <img src="/images/photo-1602498456745-e9503b30470b.jpg" alt="" />
            <li class="title">${title}</li>
            <li for="genretag" class="genre-tag">${genreTag}</li>
            <li for="purpose-tag" class="purpose-tag">${purposeTag}</li>
          </div>`;
          wokshopApprovalList.insertAdjacentHTML('beforeend', tempHtml);
        }
        if (status === 'finished') {
          tempHtml = `<div class="workshop">
            <img src="/images/images.jpg" alt="" />
            <li class="title">${title}</li>
            <li for="genretag" class="genre-tag">${genreTag}</li>
            <li for="purpose-tag" class="purpose-tag">${purposeTag}</li>
          </div>`;
          wokshopFinishedList.insertAdjacentHTML('beforeend', tempHtml);
        }
        if (status === 'rejected') {
          tempHtml = `<div class="workshop">
            <img src="/images/header.png" alt="" />
            <li class="title">${title}</li>
            <li for="genretag" class="genre-tag">${genreTag}</li>
            <li for="purpose-tag" class="purpose-tag">${purposeTag}</li>
          </div>`;
          wokshopRequestList.insertAdjacentHTML('beforeend', tempHtml);
        }
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
