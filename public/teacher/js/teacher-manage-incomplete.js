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

const getTeacherManageIncomplete = () => {
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
        const purposeTag_name = data[i].purposeTag_name;
        const total_time = data[i].workshop_total_time;
        let hours = Math.floor(total_time / 60); // 60으로 나눈 몫을 구합니다
        let remainingMinutes = total_time % 60; // 60으로 나눈 나머지를 구합니다
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
        const createdDate = `${forFormat.getFullYear()}-${
          forFormat.getMonth() + 1
        }-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;

        let buttonHtml = '';
        switch (status) {
          case 'request':
            buttonHtml = `
                        <button type="radio" class="incomplete-Button" onclick="rejectButton(${Id})">취소 하기</button>
                        <button type="radio" class="incomplete-Button" onclick="request(${Id})" id="requestButton">수락 하기</button>
                         `;
            break;
          case 'non_payment':
            buttonHtml = `
                        <div class="non_payment-Button" onclick="non_payment(${Id})" id="non_paymentButton">결제 대기중</div>
                        `;
            break;
          case 'waiting_lecture':
            buttonHtml = `
                        <button type="radio" class="incomplete-Button" onclick="waiting_lecture(${Id})" id="completeButton">결제 완료</button>
                        `;
            break;
        }
        let tempHtml = ``;
        tempHtml += `
                    <div class="teacher-manage-div" >
                        <div class="workshop-information-Div">
                            <div class="teacher-workshop-li-div">
                                <img src="${workshop_thumb}" alt="" />
                                <li class="workshop-information-li-title">제목</li>
                                <li class="workshop-information-li">최소인원</li>
                                <li class="workshop-information-li">최대인원</li>
                                <li class="workshop-information-li-tag">장르태그</li>
                                <li class="workshop-information-li">총시간</li>
                                <li class="workshop-information-li">가격</li>
                            </div>
                            <div class="workshop-information-div">
                                <li class="workshop-information-title-data">${workshop_title}</li>
                                <li class="workshop-information-data">${min_member}</li>
                                <li class="workshop-information-data">${max_member}명</li>
                                <li class="workshop-information-tag-data">${genreTag_name}<br>${purposeTag_name}</li>
                                <li class="workshop-information-data">${hours}시간 ${remainingMinutes}분</li>
                                <li class="workshop-information-data">${price}원</li>
                            </div>
                        </div>
                        <div class="workshop-information-Div2">
                            <div class="teacher-workshop-apply-div">
                                <li class="workshop-information-apply">설명</li>
                                <li class="workshop-information-apply">업체명</li>
                                <li class="workshop-information-apply">휴대폰 번호</li>
                                <li class="workshop-information-apply">인원수</li>
                                <li class="workshop-information-apply">이메일</li>
                                <li class="workshop-information-apply">생성날짜</li>
                            </div>
                            <div class="workshop-information-apply-div">
                                <li class="workshop-information-apply-data">${etc}</li>
                                <li class="workshop-information-apply-data">${company}</li>
                                <li class="workshop-information-apply-data">${phone_number}</li>
                                <li class="workshop-information-apply-data">${member_cnt}명</li>
                                <li class="workshop-information-apply-data">${email}</li>
                                <li class="workshop-information-apply-data">${createdDate}</li>
                            </div>
                            <div id = button-div>
                                      ${buttonHtml}
                            </div>
                        </div
                    </div>
                    `;
        workshopincompleteList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getTeacherManageIncomplete();
      }
    });
};

document.addEventListener('DOMContentLoaded', () => {
  getTeacherManageIncomplete();
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
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        request(Id, status);
      }
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
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        waiting_lecture(Id, status);
      }
    });
}

function rejectButton(Id) {
  axios({
    method: 'patch',
    url: `/api/teacher/workshops/manage/reject/${Id}`,
    data: {},
  })
    .then((response) => {
      const data = response.data;
      alert(data.message);
      window.location.reload();
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        rejectButton(Id);
      }
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
