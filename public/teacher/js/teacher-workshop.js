document.addEventListener('DOMContentLoaded', () => {
  const wokshopApprovalList = document.getElementById('wokshop-approvalList');
  const wokshopFinishedList = document.getElementById('wokshop-finishedList');
  const wokshopRequestList = document.getElementById('wokshop-requestList');
  const img = document.getElementById('img');

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
        const workshop_id = data[i].workshop_id;
        const splitPurposeTag = purposeTag.split(',');
        let purposeTag1 = splitPurposeTag[0];
        let purposeTag2 = '';
        if (splitPurposeTag.length > 1) {
          purposeTag2 = '#' + splitPurposeTag[1];
        }
        const status = data[i].workshop_status;
        let tempHtml = ``;
        if (status === 'approval' && purposeTag2 !== undefined) {
          tempHtml = `
                        <div class="workshop" id="img" onclick="workshopDetail(${workshop_id})">
                          <img src=${thumb} alt="">
                          <div class="card-text">
                          <li class="title">${title}</li>
                          <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
                        </div>
                    </div>`;
          wokshopApprovalList.insertAdjacentHTML('beforeend', tempHtml);
        } else if (status === 'finished') {
          tempHtml = `<div class="workshop" id="img" onclick="workshopDetail(${workshop_id})">
                          <img src=${thumb} alt="">
                          <div class="card-text">
                            <li class="title">${title}</li>
                            <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
                          </div>
                      </div>`;
          wokshopFinishedList.insertAdjacentHTML('beforeend', tempHtml);
        } else if (status === 'request') {
          tempHtml = `<div class="workshop" id="img" onclick="workshopDetail(${workshop_id})">
                        <img src=${thumb} alt="">
                        <div class="card-text">
                        <li class="title">${title}</li>
                        <li for="tag" class="tag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
                      </div>
                  </div>`;
          wokshopRequestList.insertAdjacentHTML('beforeend', tempHtml);
        } else if (status === 'rejected') {
          tempHtml = `<div class="workshop" id="img" onclick="workshopDetail(${workshop_id})">
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
      const { data } = response.response;
      alert(data.error);
    });
});

function workshopDetail(id) {
  axios({
    method: 'get',
    url: `/api/teacher/workshop/detail/${id}`,
    data: {},
  })
    .then((response) => {
      const data = response.data.detailWorkshop;
      for (let i = 0; i < data.length; i++) {
        const workshop_category = data[i].workshop_category;
        const genreTag_name = data[i].genreTag_name;
        const subImage = data[i].img_name;
        const subImageSplit = subImage.split(',');
        let subImage1 = subImageSplit[0];
        let subImage2 = subImageSplit[1];
        let subImage3 = subImageSplit[2];
        const purposeTag_name = data[i].purposeTag_name;
        const workshop_createdAt = data[i].workshop_createdAt;
        const forFormat = new Date(workshop_createdAt);
        const createdDate = `${forFormat.getFullYear()}-${forFormat.getMonth()}-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;
        const workshop_desc = data[i].workshop_desc;
        const workshop_location = data[i].workshop_location;
        const workshop_max_member = data[i].workshop_max_member;
        const workshop_min_member = data[i].workshop_min_member;
        const workshop_price = data[i].workshop_price;
        const workshop_thumb = data[i].workshop_thumb;
        const workshop_title = data[i].workshop_title;
        const total_time = data[i].workshop_total_time;
        let hours = Math.floor(total_time / 60); // 60으로 나눈 몫을 구합니다
        let Minutes = total_time % 60; // 60으로 나눈 나머지를 구합니다
        const workshop_video = data[i].workshop_video;
        const workshop_id = data[i].workshop_id;

        if (!subImage1) {
          subImage1 === '';
        }

        let tempHtml = ``;
        tempHtml = `
        <div id="workshopBox">
            <div class="image">
                <img src=${workshop_thumb} alt="">
            </div>
            <div class="teacher-workshop-li-div">
                <li class="teacher-workshop-li">유형</li>
                <li class="teacher-workshop-li-title">제목</li>
                <li class="teacher-workshop-li">최소 인원</li>
                <li class="teacher-workshop-li">최대 인원</li>
                <li class="teacher-workshop-li">태그</li>
                <li class="teacher-workshop-li">총 시간</li>
                <li class="teacher-workshop-li">가격</li>
                <li class="teacher-workshop-li">지역</li>
                <li class="teacher-workshop-li">생성 날짜</li>
            </div>
            <div class="workshop-information-div">
                <li class="workshop-information-li">${workshop_category}</li>
                <li class="workshop-information-li-title">${workshop_title}</li>
                <li class="workshop-information-li">${workshop_min_member}명</li>
                <li class="workshop-information-li">${workshop_max_member}명</li>
                <li class="workshop-information-li">#${genreTag_name} #${purposeTag_name}</li>
                <li class="workshop-information-li">${hours}시간${Minutes}분</li>
                <li class="workshop-information-li">${workshop_price}원</li>
                <li class="workshop-information-li">${workshop_location}</li>
                <li class="workshop-information-li">${createdDate}</li>
            </div>
            <div id="more-img-wrap1">
                <label for="workshop" class="form-label sub-Img-label"
                  >서브 이미지</label
                >
            <div class="subImage">
                <img src=${subImage1} alt="">
                <img src=${subImage2} alt="">
                <img src=${subImage3} alt="">
            </div>
        </div>
        <div class="mb-3 video-contents-div">
          <div class="video-content-wrap">
            <label for="workshop" class="form-label workshop-video-li"
              >영상</label
            >
            <div class="video-one-set-wrap">
              <div class="video-show-tag-wrap">
                <video id="video-show-tag" controls></video>
              </div>
              <video src="${workshop_video}"></video>
            </div>
          </div>
        </div>
        <div class="mb-3 contents-div">
          <label
            for="exampleFormControlTextarea1"
            class="form-label workshop-description-li"
            >워크샵 설명</label
          >
          <li class="desc">${workshop_desc}</li>
        </div>
        `;
        document.getElementById('detailWorkshopList').innerHTML = tempHtml;
      }
    })
    .catch((response) => {
      const { data } = response.response;
      alert(data.error);
    });
}
// click on 라벨 추가 모달 열기
$(document).on('click', '#img', function (e) {
  $('#modal').addClass('show');
});

// 모달 닫기
$(document).on('click', '#close_btn', function (e) {
  $('#modal').removeClass('show');
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
