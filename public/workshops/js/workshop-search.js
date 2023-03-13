window.addEventListener('DOMContentLoaded', function () {
  getAllWorkshops();
  searchWorkshops();
});

// 모든 데이터 보여주기
function getAllWorkshops() {
  const url = `/api/workshops/search`;
  const params = {};

  axios
    .get(url)
    .then((res) => {
      const workshops = res.data.data;
      console.log(res.data.data);
      console.log(workshops.length);
      console.log(url, params);

      // 검색 결과 건수 표시
      document.querySelector(
        '.workshop-search-result',
      ).innerHTML = `검색 결과 ${workshops.length}건`;

      $('.workshop-result-list').empty();
      workshops.forEach((element) => {
        let temp = `<div class="col">
      <div class="card h-100">
      <a href="/workshops/detail?workshopId=${element.workshop_id}">  
      <img
          src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
          class="card-img-top"
          alt="..."
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${element.workshop_title}</h5>
          <p class="card-text">${element.workshop_category}</p>
          <p class="card-text">비용: ${element.workshop_price}원</p>
          <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
          <p class="card-text">시간: ${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_name} #${element.purposeTag_name}</p>
        </div>
      </div>
    </div>`;
        $('.workshop-result-list').append(temp);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

// 워크샵 필터링 검색
function searchWorkshops() {
  const url = `/api/workshops/search`;
  const params = {};

  let categorySelect = document.querySelector('.category');
  let locationSelect = document.querySelector('.location');
  let purposeSelect = document.querySelector('.purpose');
  let genreSelect = document.querySelector('.genre');
  let memberSelect = document.querySelector('.member-cnt');

  // 카테고리 조건 검색
  categorySelect.addEventListener('change', function () {
    const category = categorySelect.options[categorySelect.selectedIndex].value;
    params.category = category;

    axios
      .get(url, { params })
      .then((res) => {
        const workshops = res.data.data;
        console.log(res.data.data);
        console.log(workshops.length);
        console.log(url, params);

        // 검색 결과 건수 표시
        document.querySelector(
          '.workshop-search-result',
        ).innerHTML = `검색 결과 ${workshops.length}건`;

        $('.workshop-result-list').empty();
        workshops.forEach((element) => {
          let temp = `<div class="col">
      <div class="card h-100">
      <a href="/workshops/detail?workshopId=${element.workshop_id}">  
      <img
          src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
          class="card-img-top"
          alt="..."
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${element.workshop_title}</h5>
          <p class="card-text">${element.workshop_category}</p>
          <p class="card-text">비용: ${element.workshop_price}원</p>
          <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
          <p class="card-text">시간: ${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_name} #${element.purposeTag_name}</p>
        </div>
      </div>
    </div>`;
          $('.workshop-result-list').append(temp);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // 인원 조건 검색
  memberSelect.addEventListener('input', function () {
    const memberCnt = memberSelect.value;
    params.memberCnt = Number(memberCnt);

    axios
      .get(url, { params })
      .then((res) => {
        const workshops = res.data.data;
        console.log(res.data.data);
        console.log(workshops.length);
        console.log(url, params);

        // 검색 결과 건수 표시
        document.querySelector(
          '.workshop-search-result',
        ).innerHTML = `검색 결과 ${workshops.length}건`;

        $('.workshop-result-list').empty();
        workshops.forEach((element) => {
          let temp = `<div class="col">
      <div class="card h-100">
      <a href="/workshops/detail?workshopId=${element.workshop_id}">  
      <img
          src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
          class="card-img-top"
          alt="..."
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${element.workshop_title}</h5>
          <p class="card-text">${element.workshop_category}</p>
          <p class="card-text">비용: ${element.workshop_price}원</p>
          <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
          <p class="card-text">시간: ${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_name} #${element.purposeTag_name}</p>
        </div>
      </div>
    </div>`;
          $('.workshop-result-list').append(temp);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // 지역 조건 검색
  locationSelect.addEventListener('change', function () {
    const location = locationSelect.options[locationSelect.selectedIndex].value;
    params.location = location;

    axios
      .get(url, { params })
      .then((res) => {
        const workshops = res.data.data;
        console.log(res.data.data);
        console.log(workshops.length);

        // 검색 결과 건수 표시
        document.querySelector(
          '.workshop-search-result',
        ).innerHTML = `검색 결과 ${workshops.length}건`;

        $('.workshop-result-list').empty();
        workshops.forEach((element) => {
          let temp = `<div class="col">
      <div class="card h-100">
      <a href="/workshops/detail?workshopId=${element.workshop_id}">  
      <img
          src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
          class="card-img-top"
          alt="..."
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${element.workshop_title}</h5>
          <p class="card-text">${element.workshop_category}</p>
          <p class="card-text">비용: ${element.workshop_price}원</p>
          <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
          <p class="card-text">시간: ${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_name} #${element.purposeTag_name}</p>
        </div>
      </div>
    </div>`;
          $('.workshop-result-list').append(temp);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // 목적 조건 검색
  purposeSelect.addEventListener('change', function () {
    const purpose = purposeSelect.options[purposeSelect.selectedIndex].value;
    params.purpose = purpose;

    axios
      .get(url, { params })
      .then((res) => {
        const workshops = res.data.data;
        console.log(res.data.data);
        console.log(workshops.length);

        // 검색 결과 건수 표시
        document.querySelector(
          '.workshop-search-result',
        ).innerHTML = `검색 결과 ${workshops.length}건`;

        $('.workshop-result-list').empty();
        workshops.forEach((element) => {
          let temp = `<div class="col">
      <div class="card h-100">
      <a href="/workshops/detail?workshopId=${element.workshop_id}">  
      <img
          src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
          class="card-img-top"
          alt="..."
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${element.workshop_title}</h5>
          <p class="card-text">${element.workshop_category}</p>
          <p class="card-text">비용: ${element.workshop_price}원</p>
          <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
          <p class="card-text">시간: ${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_name} #${element.purposeTag_name}</p>
        </div>
      </div>
    </div>`;
          $('.workshop-result-list').append(temp);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // 장르 조건 검색
  genreSelect.addEventListener('change', function () {
    const genre = genreSelect.options[genreSelect.selectedIndex].value;
    params.genre = genre;

    axios
      .get(url, { params })
      .then((res) => {
        const workshops = res.data.data;
        console.log(res.data.data);
        console.log(workshops.length);

        // 검색 결과 건수 표시
        document.querySelector(
          '.workshop-search-result',
        ).innerHTML = `검색 결과 ${workshops.length}건`;

        $('.workshop-result-list').empty();
        workshops.forEach((element) => {
          let temp = `<div class="col">
      <div class="card h-100">
      <a href="/workshops/detail?workshopId=${element.workshop_id}">  
      <img
          src="https://tgzzmmgvheix1905536.cdn.ntruss.com/2017/10/e48b1391e6714813a1ff65dcd254488f"
          class="card-img-top"
          alt="..."
        />
        </a>
        <div class="card-body">
          <h5 class="card-title">${element.workshop_title}</h5>
          <p class="card-text">${element.workshop_category}</p>
          <p class="card-text">비용: ${element.workshop_price}원</p>
          <p class="card-text">인원: ${element.workshop_min_member}~${element.workshop_max_member}명</p>
          <p class="card-text">시간: ${element.workshop_total_time}분</p>
          <p class="card-text">#${element.genre_name} #${element.purposeTag_name}</p>
        </div>
      </div>
    </div>`;
          $('.workshop-result-list').append(temp);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// 재검색(초기화) 버튼 클릭 시
function reload() {
  location.reload();
}
