document.addEventListener('DOMContentLoaded', () => {
    const wokshopApprovalList = document.getElementById('wokshop-approvalList');
    const wokshopFinishedList = document.getElementById('wokshop-finishedList');
    // document.ready(function () {
    axios({
      method: 'get',
      url: '/api/mypage/workshops/wishlist',
      data: {},
    })
      .then((response) => {
        const data = response.data;
        for (let i = 0; i < data.length; i++) {
          const thumb = data[i].workshop_thumb;
          const title = data[i].workshop_title;
          const genreTag = data[i].genreTag_name;
          const purposeTag = data[i].purposeTag_name;
          const status = data[i].workshop_status;
          let tempHtml = ``;
          if (status === 'approval') {
            tempHtml = `<div class="workshop">
                <img src="/images/photo-1602498456745-e9503b30470b.jpg" alt="" />
                <li class="title">${title}</li>
                <li for="genretag" class="genre-tag">${genreTag}</li>
                <li for="purpose-tag" class="purpose-tag">${purposeTag}</li>
              </div>`;
            wokshopApprovalList.insertAdjacentHTML('beforeend', tempHtml);
          } else if (status === 'finished') {
            tempHtml = `<div class="workshop">
                <img src="/images/images.jpg" alt="" />
                <li class="title">${title}</li>
                <li for="genretag" class="genre-tag">${genreTag}</li>
                <li for="purpose-tag" class="purpose-tag">${purposeTag}</li>
              </div>`;
            wokshopFinishedList.insertAdjacentHTML('beforeend', tempHtml);
          } 
        }
      })
      .catch((response) => {
        console.log(response);
      });
  });
  function workshops() {
    window.location.href = '/mypage/workshops';
  }
  function wishlist() {
    window.location.href = '/mypage/workshops/wishlist';
  }
  function teacherWorkshop() {
    window.location.href = '/teacher/workshop';
  }
  function teacherRegister() {
    window.location.href = '/teacher/register';
  }
  