window.addEventListener('DOMContentLoaded', function () {
  searchWorkshops();
});

// 전체 워크샵 조회
function searchWorkshops() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let category = param.get('category');
  let location = param.get('location');
  let url = '/api/workshops/search';

  if (category) {
    url += `?category=${category}`;
  }

  axios
    .get(url)
    .then((res) => {
      const workshops = res.data.data;
      console.log(res.data.data);
      console.log(workshops.length);

      // 검색 결과 건수 표시
      document.querySelector(
        '.workshop-search-result',
      ).innerHTML = `검색 결과 ${workshops.length}건`;

      workshops.forEach((element) => {
        let temp = `<div class="col">
    <div class="card h-100">
      <img
        src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
        class="card-img-top"
        alt="..."
      />
      <div class="card-body">
        <h5 class="card-title">${element.workshop_title}</h5>
        <p class="card-text">${element.workshop_category}</p>
        <p class="card-text">비용: ${element.workshop_price}원</p>
        <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
        <p class="card-text">시간: ${element.workshop_total_time}분</p>
        <p class="card-text">#${element.genre_tag_name} #${element.purposeTag_name[0]} #${element.purposeTag_name[1]}</p>
      </div>
    </div>
  </div>`;
        $('.workshop-result-list').append(temp);
      });
    })
    .catch((err) => {});
}
