document.addEventListener('DOMContentLoaded', () => {
  const wokshopApprovalList = document.getElementById('wokshop-approvalList');
  const wokshopFinishedList = document.getElementById('wokshop-finishedList');
  const wokshopRequestList = document.getElementById('wokshop-requestList');
  axios({
    method: 'get',
    url: '/api/teacher/workshops',
    data: {},
  })
    .then((response) => {
      const data = response.data.workshop;
      for (let i = 0; i < data.length; i++) {
        const thumb = data[i].workshop_thumb;
        const title = data[i].workshop_title;
        const genreTag = data[i].genreTag_name;
        const purposeTag = data[i].purposeTag_name;
        const splitPurposeTag = purposeTag.split(',');
        let purposeTag1 = splitPurposeTag[0];
        let purposeTag2 = '';
        if (splitPurposeTag.length > 1) {
          purposeTag2 = '#' + splitPurposeTag[1];
        }
        const status = data[i].workshop_status;
        let tempHtml = ``;
        if (status === 'approval' && purposeTag2 !== undefined) {
          tempHtml = `<div class="workshop">
                          <img src=${thumb} alt="">
                          <div class="card-text">
                          <li class="title">${title}</li>
                          <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
                        </div>
                    </div>`;
          wokshopApprovalList.insertAdjacentHTML('beforeend', tempHtml);
        } else if (status === 'finished') {
          tempHtml = `<div class="workshop">
                          <img src=${thumb} alt="">
                          <div class="card-text">
                            <li class="title">${title}</li>
                            <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
                          </div>
                      </div>`;
          wokshopFinishedList.insertAdjacentHTML('beforeend', tempHtml);
        } else if (status === 'request') {
          tempHtml = `<div class="workshop">
                        <img src=${thumb} alt="">
                        <div class="card-text">
                        <li class="title">${title}</li>
                        <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
                      </div>
                  </div>`;
          wokshopRequestList.insertAdjacentHTML('beforeend', tempHtml);
        } else if (status === 'rejected') {
          tempHtml = `<div class="workshop">
                          <img src=${thumb} alt="" />
                          <div class="card-text">
                          <li class="title">${title}</li>
                              <div class="tag-div">
                                  <div class="test">
                                      <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}
                                      <span class="reject">반려</span>
                                      </li>
                                      
                                  </div>
                              </div>
                          </div>
                       </div>`;
          wokshopRequestList.insertAdjacentHTML('beforeend', tempHtml);
        }
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
