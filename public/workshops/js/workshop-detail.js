window.addEventListener('DOMContentLoaded', function () {
  getWorkshopDetail();
});

// 워크샵 상세 조회 API
function getWorkshopDetail() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');

  axios
    .get(`/api/workshops/${workshopId}`)
    .then((res) => {
      const workshop = res.data.data[0];

      let temp_html = `<div class="row">
      <div class="col">
        <div class="workshop-thumb">
          <img src="/images/eraser-class-thumb.jpg" alt="..." />
        </div>
      </div>

      <!-- 워크샵 개요 -->
      <div class="col">
        <div class="workshop-summary">
          <div class="workshop-title">${workshop.workshop_title}</div>
          <div class="workshop-star">${workshop.averageStar}점</div>
          <div class="workshop-category">${workshop.workshop_category}</div>
          <div class="workshop-location">
          활동 가능 지역 ${
            workshop.workshop_location === null
              ? '(온라인만 가능)'
              : workshop.workshop_location
          }</div>
          <div class="workshop-member-cnt">인원 ${
            workshop.workshop_min_member
          }~${workshop.workshop_max_member}명</div>
          <div class="workshop-total-time">총 시간 ${
            workshop.workshop_total_time
          }분</div>
          <div class="workshop-genre">분야${workshop.genre}</div>
          <div class="workshop-purpose">목적${workshop.purpose}</div>
          <div class="workshop-price">${workshop.workshop_price}원</div>
          <div>*1인 기준</div>
          <div class="order-wish-buttons">
            <button type="button" class="btn btn-primary order" data-bs-toggle="modal" data-bs-target="#exampleModal">
              신청하기
            </button>
            <button type="button" class="btn btn-outline-primary wish" onclick="addToWish()">
              찜하기
            </button>
          </div>
        </div>
      </div>
    </div>`;
      $('#workshop-image-info').append(temp_html);
    })
    .catch((error) => {});
}

// 찜하기
function addToWish(user_id, workshop_id) {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');

  axios
    .post(`/api/workshops/${workshopId}/wish`, { user_id, workshop_id }) // user_id 임시로 하드코딩
    .then((res) => {
      console.log(res);
      alert(res.data.data.message);
    })
    .catch((err) => {});
}