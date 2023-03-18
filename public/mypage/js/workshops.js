window.addEventListener('DOMContentLoaded', function () {});

// 수강 예정 워크샵 불러오기
function getSoonWorkshops() {
  axios
    .get('/api/mypage/workshops/soon')
    .then((res) => {
      const workshops = res.data.data;

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
          <div class="card h-100">
          <a href="/workshops/detail?workshopId=${element.workshop_id}">
          <img class="card-img-top" id="best-workshop-thumb alt="..." src="${element.thumbUrl}" /></a>
            <div class="card-body">
              <h5 class="card-title">${element.workshop_title}</h5>
              <p class="card-text">${element.workshop_category}</p>
              <p class="card-text">비용: ${element.workshop_price}원</p>
              <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
              <p class="card-text">시간: ${element.workshop_total_time}분</p>
              <p class="card-text">#${element.genre_tag_name} #${element.purpose_name[0]} #${element.purpose_name[1]}</p>
            </div>
          </div>
        </div>`;
        $('#best-workshop-list').append(tempHtml);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
