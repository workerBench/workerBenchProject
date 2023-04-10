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

window.addEventListener('DOMContentLoaded', function () {
  getWishList();
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

// 찜 목록 불러오기
function getWishList() {
  axios
    .get('/api/mypage/workshops/wishlist')
    .then((res) => {
      const workshops = res.data.data;

      workshops.forEach((element) => {
        let tempHtml = `<div class="col" id="wish-card-${element.workshop_id}">
          <div class="card h-100">
            <a href="/workshops/detail?workshopId=${element.workshop_id}">
            <img class="card-img-top" id="workshop-thumb alt="..." src=${
              element.workshop_thumbUrl
            } /></a>
            <div class="card-body">
              <p class="workshop-title">${element.workshop_title}</p>
              <span class="workshop-category">${
                element.workshop_category === 'online' ? '온라인' : '오프라인'
              }</span>
              <p class="workshop-price">비용 &nbsp;${
                element.workshop_price
              }원</p>
              <p class="card-text">인원 &nbsp;${element.workshop_min_member}~${
          element.workshop_max_member
        }명</p>
              <p class="card-text">시간 &nbsp;${
                element.workshop_total_time
              }분</p>
            </div>
            <button type="button" class="wish-button" onclick="cancelWish(${
              element.workshop_id
            })">♥</button>
          </div>
      </div>`;
        $('#wish-list').append(tempHtml);
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getWishList();
      }
    });
}

// 찜하기 해제
function cancelWish(workshopId) {
  const check = confirm('찜 하기를 취소하시겠습니까?');
  if (check === false) {
    return;
  }

  axios
    .post(`/api/workshops/${workshopId}/wish`)
    .then((res) => {
      // 삭제해야 할 카드
      const wishCard = document.querySelector(`#wish-card-${workshopId}`);
      wishCard.remove();

      alert(res.data.data.message);
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        cancelWish(workshopId);
      }
      if (!result) {
        location.reload();
      }
    });
}
