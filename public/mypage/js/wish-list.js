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
    .catch((error) => {
      alert(error.response.data.message);
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
    .catch((err) => {
      alert(err.response.data.message);
      location.reload();
    });
}
