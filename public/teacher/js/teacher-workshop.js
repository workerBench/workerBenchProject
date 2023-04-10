// access 토큰이 만료되었을 시 refresh 토큰으로 access 토큰 재발급을 요청
const requestAccessToken = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/refreshtoken/user',
    });
    return true;
  } catch (err) {
    return false;
  }
};

// 에러 발생 시 상태 코드에 따른 로직 실행
const getErrorCode = async (statusCode, errorMessage) => {
  if (statusCode === 400) {
    alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
    return false;
  }
  if (statusCode === 401) {
    const refreshRes = await requestAccessToken();
    if (!refreshRes) {
      alert('현재 로그인이 되어있지 않습니다. 로그인 후 이용 가능합니다.');
      location.href = '/auth/login';
      return;
    }
    return true;
  }
  alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
  return false;
};

const getTeacherWorkshops = () => {
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
                        <div class="workshop">
                          <img src=${thumb} alt="">
                          <div class="card-text">
                          <li class="title">${title}</li>
                          <button type="radio"  id="workshopDetail" onclick="updateWorkshop(${workshop_id})">워크샵 수정 하기</button>
                          <button type="radio"  id="workshopDetail" onclick="workshopDetail(${workshop_id})">워크샵 상세 보기</button>
                          <li for="tag" class="approvalTag">#${genreTag} #${purposeTag1} ${purposeTag2}</li>
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
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getTeacherWorkshops();
      }
    });
};

document.addEventListener('DOMContentLoaded', () => {
  getTeacherWorkshops();
});

// 강사 - 나의 워크샵 목록에서 워크샵 카드 클릭 시 모달창으로 상세 페이지 업.
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
        const subImage = data[i].subImageUrlArray;

        let subImageHtmlWrapper = ``;
        if (subImage.length !== 0) {
          for (let i = 0; i < subImage.length; i++) {
            subImageHtmlWrapper += `
              <img src=${subImage[i]} alt="">
            `;
          }
        }

        const purposeTag_name = data[i].purposeTag_name;
        const workshop_createdAt = data[i].workshop_createdAt;
        const forFormat = new Date(workshop_createdAt);
        const createdDate = `${forFormat.getFullYear()}-${
          forFormat.getMonth() + 1
        }-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;
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
        const workshop_video = data[i].workshop_videoUrl;
        const workshop_id = data[i].workshop_id;

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
                <li class="workshop-information-li">${hours}시간 ${Minutes}분</li>
                <li class="workshop-information-li">${workshop_price}원</li>
                <li class="workshop-information-li">${workshop_location}</li>
                <li class="workshop-information-li">${createdDate}</li>
            </div>
            <div id="more-img-wrap1">
                <label for="workshop" class="form-label sub-Img-label"
                  >서브 이미지</label
                >
            <div class="subImage">
                ${subImageHtmlWrapper}
            </div>
        </div>
        <div style="width:100%; height: 350px;">
          
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
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        workshopDetail(id);
      }
    });
}

function updateWorkshop(id) {
  axios({
    method: 'get',
    url: `/api/teacher/workshop/detail/${id}`,
    data: {},
  })
    .then((response) => {
      console.log(response);
      const data = response.data.detailWorkshop;
      for (let i = 0; i < data.length; i++) {
        const workshop_category = data[i].workshop_category;
        const genreTag_name = data[i].genreTag_name;
        const subImage = data[i].subImageUrlArray;

        let subImageHtmlWrapper = ``;
        if (subImage.length !== 0) {
          for (let i = 0; i < subImage.length; i++) {
            subImageHtmlWrapper += `
              <img src=${subImage[i]} alt="">
            `;
          }
        }

        const purposeTag_name = data[i].purposeTag_name;
        const splitPurposeTag = purposeTag_name.split(',');
        let purposeTag1 = splitPurposeTag[0];
        let purposeTag2 = '';
        if (splitPurposeTag.length > 1) {
          purposeTag2 = splitPurposeTag[1];
        }
        const workshop_createdAt = data[i].workshop_createdAt;
        const forFormat = new Date(workshop_createdAt);
        const createdDate = `${forFormat.getFullYear()}-${
          forFormat.getMonth() + 1
        }-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;
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
        const workshop_video = data[i].workshop_videoUrl;
        const workshop_id = data[i].workshop_id;
        let tempHtml = ``;
        tempHtml = `
        <div id="workshop-registerBox">
        <div class="image">
            <label for="workshop" class="form-label workshop-description-li">썸네일</label>
            <img src=${workshop_thumb} alt="">
        </div>
        <div class="workshop-information1">
            <span class="caution-video">* 빈칸없이 입력해주세요</span>
            <span class="caution-video"
              >* 목적태그는 최소 한개이상 <br />선택해주세요</span
            >
        <select name="job" id="category">
          <option value="${workshop_category}" disabled selected>${workshop_category}</option>
          <option value="online">online</option>
          <option value="offline">offline</option>
        </select>
        <input
          type="text"
          class="form-control"
          id="title"
          value="${workshop_title}"
          maxlength="22"
        />
        <input
          type="text"
          class="form-control"
          id="minMember"
          value="${workshop_min_member}"
          maxlength="3"
          onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"
        />
        <input
          type="text"
          class="form-control"
          id="maxMember"
          value="${workshop_min_member}"
          maxlength="3"
          onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"
        />
        <select name="job" id="genreId">
          <option value="" disabled selected>장르를 선택해주세요</option>
          <option value="1">문화예술</option>
          <option value="2">식음</option>
          <option value="3">심리진단</option>
          <option value="4">운동</option>
        </select>
        <select name="job" id="purposeTagId1">
          <option value="" disabled selected>목적을 선택해주세요</option>
          <option value="1">동기부여</option>
          <option value="2">팀워크</option>
          <option value="3">회식</option>
          <option value="4">힐링</option>
        </select>
        <select name="job" id="purposeTagId2">
          <option value="" disabled selected>목적을 선택해주세요</option>
          <option value="1">동기부여</option>
          <option value="2">팀워크</option>
          <option value="3">회식</option>
          <option value="4">힐링</option>
        </select>
        <input
          type="text"
          class="form-control"
          id="totalTime"
          value="${total_time}"
          maxlength="3"
          onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"
        />
        <input
          type="text"
          class="form-control"
          id="price"
          value="${workshop_price}"
          maxlength="7"
          onKeyup="this.value=this.value.replace(/[^0-9]/g,'');"
        />
        <select name="job" id="location">
          <option value="${workshop_location}" disabled selected>${workshop_location}</option>
          <option value="서울">서울</option>
          <option value="경기">경기도</option>
          <option value="강원">강원도</option>
          <option value="경상">경상도</option>
          <option value="전라">전라도</option>
          <option value="충청">충청도</option>
        </select>
      </div>
      <div id="more-img-wrap1">
        <label for="workshop" class="form-label sub-Img-label1"
          >서브 이미지 (선택사항)</label
        >
        <div id="more-img-wrap">
          <div class="sub-imgs-wrap">
          <img src=${workshop_thumb} alt="">
          </div>
          <div class="sub-imgs-wrap">
          <img src=${workshop_thumb} alt="">
          </div>
          <div class="sub-imgs-wrap">
            <img src=${workshop_thumb} alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mb-3 contents-div">
      <label for="workshop" class="form-label workshop-description-li"></label>
      <span class="caution-video">* 빈칸 없이 입력해주세요.</span>
      <input type="text" class="form-control" id="desc" required></input>
    </div> -->
    <div class="mb-3 contents-div">
      <label
        for="exampleFormControlTextarea1"
        class="form-label workshop-description-li"
        >워크샵 설명</label
      >
      <textarea class="form-control" id="desc" rows="3">${workshop_desc}</textarea>
    </div>
    <div class="regiseterBtn-div">
    <button type="button"  id="updateWorkshop" onclick="updateWorkshop2(${workshop_id})">워크샵 수정 하기</button>
    </div>
        `;
        document.getElementById('detailWorkshopList').innerHTML = tempHtml;
      }
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        updateWorkshop(id);
      }
    });
}
function updateWorkshop2(id) {
  const category = document.getElementById('category').value;
  const title = document.getElementById('title').value;
  const min_member = document.getElementById('minMember').value;
  const max_member = document.getElementById('maxMember').value;
  const genre_id = document.getElementById('genreId').value;
  const purpose_tag1 = document.getElementById('purposeTagId1').value;
  const purpose_tag2 = document.getElementById('purposeTagId2').value;
  const total_time = document.getElementById('totalTime').value;
  const price = document.getElementById('price').value;
  const desc = document.getElementById('desc').value;
  const location = document.getElementById('location').value;
  const purpose_value1 = parseInt(purpose_tag1);
  const purpose_value2 = parseInt(purpose_tag2);
  if (!purpose_value1 && !purpose_value2) {
    alert('목적태그 최소 한개는 등록해주세요');
    return;
  }

  if (purpose_value1 === purpose_value2) {
    alert('중복된 목적을 선택하셨습니다.');
    return;
  }

  const purposeTagIds = [purpose_value1, purpose_value2];
  if (
    category === '' ||
    !title ||
    !min_member ||
    !max_member ||
    genre_id === '' ||
    !total_time ||
    !price ||
    !desc ||
    location === ''
  ) {
    alert('빈 칸을 채워 주세요!');
    return;
  }
  console.log(category);
  axios({
    method: 'patch',
    url: `/api/teacher/workshop/update/${id}`,
    data: {
      category,
      title,
      min_member: parseInt(min_member),
      max_member: parseInt(max_member),
      total_time: parseInt(total_time),
      price: parseInt(price),
      desc,
      location,
      genre_id: parseInt(genre_id),
      purpose_tag_id: purposeTagIds,
    },
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        updateWorkshop2(id);
      }
    });
}

// click on 라벨 추가 모달 열기
$(document).on('click', '#workshopDetail', function (e) {
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
