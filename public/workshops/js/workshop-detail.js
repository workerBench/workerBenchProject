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
      console.log(workshop);
      console.log(workshop.star.split(','));

      // 평가 - 문자열 배열 => 숫자 배열로 변환
      let arr_star = workshop.star.split(',').map((star) => Number(star));
      console.log(arr_star);
      // 평균값 구하기 (값이 2번씩 중복돼서 2로 한번 더 나눠야 함)
      let avg_star =
        arr_star.reduce((sum, cur) => {
          return sum + cur;
        }) / 4;

      console.log(avg_star);

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
          <div class="workshop-star">${avg_star}점</div>
          <div class="workshop-category">${workshop.workshop_category}</div>
          <div class="workshop-location">
            활동 가능 지역 <span>${workshop.workshop_location}</span>
          </div>
          <div class="workshop-member-cnt">인원 ${workshop.workshop_min_member}~${workshop.workshop_max_member}명</span></div>
          <div class="workshop-total-time">총 시간 ${workshop.workshop_total_time}분</span></div>
          <div class="workshop-genre">분야 &nbsp<span>${workshop.genre}</span></div>
          <div class="workshop-purpose">목적 &nbsp<span>${workshop.purpose}</span></div>
          <div class="workshop-price">${workshop.workshop_price}원</div>
          <div>*1인 기준</div>
          <div class="order-wish-buttons">
            <button type="button" class="btn btn-primary order" data-bs-toggle="modal" data-bs-target="#exampleModal">
              신청하기
            </button>
            <button type="button" class="btn btn-outline-primary wish">
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
function addToWish() {
  axios
    .post()
    .then((res) => {
      return;
    })
    .catch((err) => {});
}

// 특정 워크샵 후기 전체 조회 API
