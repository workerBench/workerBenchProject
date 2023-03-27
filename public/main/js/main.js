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

      workshops.forEach((element, index) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
        <a href="/workshops/detail?workshopId=${element.workshop_id}">
        <img class="card-img-top embed-responsive-item" id="best-workshop-thumb alt="..." src="${
          element.thumbUrl
        }" /></a>
          <div class="card-body">
            <p class="workshop-title"><span class="rank-number">${
              index + 1
            }</span> ${element.workshop_title}</p>
            <span class="workshop-category">${
              element.workshop_category === 'online' ? '온라인' : '오프라인'
            }</span>
            <p class="workshop-price">비용 &nbsp;${element.workshop_price}원</p>
            <p class="card-text">인원 &nbsp;${element.workshop_min_member}~${
          element.workshop_max_member
        }명</p>
            <p class="card-text">시간 &nbsp;${element.workshop_total_time}분</p>
            <p class="card-text">#${element.genre_tag_name}
            #${element.purpose_name[0]}
            ${element.purpose_name[1] ? `#${element.purpose_name[1]}` : ''}
          </p>
        </div>
      </div>`;
        $('#best-workshop-list').append(tempHtml);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// 신규 워크샵 불러오기
function getNewWorkshops() {
  axios
    .get('/api/workshops/new')
    .then((res) => {
      const workshops = res.data.data;

      workshops.forEach((element) => {
        let temp_html = `<div class="col">
        <div class="card h-100">
            <a href="/workshops/detail?workshopId=${element.workshop_id}">
            <img class="card-img-top" id="new-workshop-thumb" alt="..." src="${
              element.thumbUrl
            }"/></a>
          <div class="card-body">
          <p class="workshop-title"> ${element.workshop_title}</p>
          <span class="workshop-category">${
            element.workshop_category === 'online' ? '온라인' : '오프라인'
          }</span>
          <p class="workshop-price">비용 &nbsp;${element.workshop_price}원</p>
          <p class="card-text">인원 &nbsp;${element.workshop_min_member}~${
          element.workshop_max_member
        }명</p>
          <p class="card-text">시간 &nbsp;${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_tag_name}
            #${element.purpose_name[0]}
            ${element.purpose_name[1] ? `#${element.purpose_name[1]}` : ''}
          </p>
          </div>
        </div>
      </div>`;
        $('#new-workshop-list').append(temp_html);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
