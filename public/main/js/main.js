window.addEventListener('DOMContentLoaded', function () {
  getBestWorkshops();
  getNewWorkshops();
});

// 인기 워크샵 불러오기
function getBestWorkshops() {
  axios
    .get('/api/workshops/best')
    .then((res) => {
      const workshops = res.data.data;
      console.log(res);
      console.log(workshops);

      workshops.forEach((element) => {
        let temp_html = `<div class="col">
        <div class="card h-100">
          <img
            src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
            class="card-img-top"
            alt="..."
          />
          <!-- a href="" 추가해서 이미지 클릭 시 해당 워크샵 상세 페이지로 렌더링해야 함-->

          <div class="card-body">
            <h5 class="card-title">${element.workshop_title}</h5>
            <p class="card-text">${element.workshop_category}</p>
            <p class="card-text">${element.workshop_price}원</p>
            <p class="card-text">${element.workshop_min_member}~${element.workshop_max_member}명</p>
            <p class="card-text">${element.workshop_total_time}분</p>
          </div>
        </div>
      </div>`;
        $('#best-workshop-list').append(temp_html);
      });
    })
    .catch((error) => {});
}

// 신규 워크샵 불러오기
function getNewWorkshops() {
  axios
    .get('/api/workshops/new')
    .then((res) => {
      const workshops = res.data.data;
      console.log(workshops);

      workshops.forEach((element) => {
        let temp_html = `<div class="col">
        <div class="card h-100">
          <img
            src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
            class="card-img-top"
            alt="..."
          />
          <!-- a href="" 추가해서 이미지 클릭 시 해당 워크샵 상세 페이지로 렌더링해야 함-->

          <div class="card-body">
            <h5 class="card-title">${element.title}</h5>
            <p class="card-text">${element.category}</p>
            <p class="card-text">${element.price}원</p>
            <p class="card-text">${element.min_member}~${element.max_member}명</p>
            <p class="card-text">${element.total_time}분</p>
          </div>
        </div>
      </div>`;
        $('#new-workshop-list').append(temp_html);
      });
    })
    .catch((error) => {});
}
