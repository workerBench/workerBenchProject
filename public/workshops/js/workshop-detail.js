window.addEventListener('DOMContentLoaded', function () {
  getWorkshopDetail();
  getWorkshopReviews();
});

// 워크샵 상세 조회
function getWorkshopDetail() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');

  axios
    .get(`/api/workshops/${workshopId}`)
    .then((res) => {
      const workshop = res.data.data.workshop[0];
      const wishCheck = res.data.data.wish; // false or true

      console.log(workshop);

      let workshopInfo = `<div class="row">
        <div class="col">
          <div class="workshop-thumb">
            <img id="workshop-thumb" alt="워크샵 이미지" src="${
              workshop.workshop_thumb
            }"/>
          </div>...
        </div>
  
        <!-- 워크샵 개요 -->
        <div class="col">
          <div class="workshop-summary">
            <div class="workshop-title">${workshop.workshop_title}</div>
            <div class="workshop-star">평가 <span id="content">${
              workshop.averageStar
            }점<span id="content"></div>
            <span class="workshop-category">${
              workshop.workshop_category === 'online' ? '온라인' : '오프라인'
            }</span>
            <div class="workshop-location">
            활동 가능 지역 <span id="content">${
              workshop.workshop_location === null
                ? '(온라인만 가능)'
                : workshop.workshop_location
            }</span></div>
            <div class="workshop-member-cnt">인원 <span id="content">${
              workshop.workshop_min_member
            }~${workshop.workshop_max_member}명<span id="content"></div>
            <div class="workshop-total-time">총 시간 <span id="content">${
              workshop.workshop_total_time
            }분<span id="content"></div>
            <div class="workshop-genre">분야 <span id="content">${
              workshop.genre
            }<span id="content"></div>
            <div class="workshop-purpose">목적 <span id="content">${
              workshop.purpose
            }<span id="content"></div>
            <div class="workshop-price">${workshop.workshop_price}원</div>
            <div>*1인 기준</div>
            <div class="order-wish-buttons">
              <button type="button" class="btn btn-primary order" data-bs-toggle="modal" data-bs-target="#exampleModal">
                신청하기
              </button>
              <button type="button" class="btn btn-outline-primary wish" onclick="addToWish()">
                ♡
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">워크샵 신청하기</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                  <input type="text" class="form-control" name="company" id="company" placeholder="회사명 (필수)" required>
                </div>
                <div class="mb-3">
                  <input type="text" class="form-control" name="name" id="name" placeholder="신청자 성함 (필수)" required>
                </div>
                <div class="mb-3">
                  <input type="email" class="form-control" name="email" id="email" placeholder="이메일 (필수)" required>
                </div>
                <div class="mb-3">
                  <input type="text" class="form-control" name="phone_number" id="phone_number" placeholder="전화번호 (필수) (- 없이 입력해주세요.)" required>
                </div>
                <div class="mb-3">
                  <input type="number" class="form-control" name="member_cnt" id="member_cnt" placeholder="인원 (필수)" min=1>
                </div>
                <div class="mb-3">
                  <input type="date" class="form-control" name="wish_date" id="wish_date" min="{{strTomorrow}}">
                  <p>* 희망하는 워크샵 진행일을 선택해주세요.</p>
                </div>
                <div class="mb-3" id="address">
                  <input id="zip-code"  class="form-control" type="text" placeholder="우편번호 검색" readonly onclick="findAddr()"> <br>
                  <input id="input-address" class="form-control" type="text" placeholder="주소 (필수) (우편번호를 검색해주세요.)" readonly> <br>
                  <input id="input_addr_detail" class="form-control" type="text" placeholder="상세 주소">
                </div>
                <div class="mb-3">
                  <input type="text" class="form-control" name="purpose" id="purpose" placeholder="워크샵 신청 목적 (필수)">
                </div>
                <div class="mb-3">
                  <textarea class="form-control" name="etc" id="etc" placeholder="기타 문의 사항 (선택)"></textarea>
                </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소하기</button>
              <button onclick="orderWorkshop()" class="btn btn-primary">제출하기</button>            </div>
          </div>
        </div>
      </div>`;
      $('#workshop-image-info').append(workshopInfo);

      // 워크샵 카테고리가 온라인일 때는 주소 입력창 숨기기
      if (workshop.workshop_category === 'online') {
        document.querySelector('#address').style.display = 'none';
      }

      // user 로그인 여부 데이터 확인 후 false면 워크샵 문의 신청 막기
      const modal = document.querySelector('#exampleModal');
      modal.addEventListener('show.bs.modal', (e) => {
        if (user === 'false') {
          alert('로그인 이후 이용 가능합니다.');
          e.preventDefault();
        }
      });

      // 찜하기 유저에 있으면 하트 칠하기
      if (wishCheck) {
        document.querySelector('.wish').textContent = '♥';
      } else {
        document.querySelector('.wish').textContent = '♡';
      }

      // 워크샵 상세 정보
      let workshopDesc = `
      <div class="tab-pane fade show active""
        id="home-tab-pane"
        role="tabpanel"
        aria-labelledby="home-tab"
        tabindex="0">
        ${workshop.workshop_desc}
      </div>`;

      $('#myTabContent').append(workshopDesc);

      // 첫 번째 방법. video.js 를 사용.
      // if (workshop.workshop_video !== '' && workshop.workshop_video !== null) {
      //   workshopDesc += `
      //     <video id="videoPlayerTag" class="video-js"
      //     controls preload="auto" width="640" height="480" style="margin-bottom: 200px;">
      //       <source src=${workshop.workshop_video} type="application/x-mpegURL" >
      //     </video>
      //   `;
      // }
      // $('#myTabContent').append(workshopDesc);
      // if (workshop.workshop_video === '' || workshop.workshop_video === null) {
      //   return;
      // }
      // const player = videojs('videoPlayerTag', {});

      // 두 번째 방법 hjs.js 를 사용.
      if (workshop.workshop_video !== '' && workshop.workshop_video !== null) {
        let videoBox = `
          <div class="video-set-wrap">
            <video id="video-player" controls>
            </video>
          </div>
        `;
        $('#home-tab-pane').append(videoBox);
      }

      if (workshop.workshop_video === '' || workshop.workshop_video === null) {
        return;
      }

      const video = document.querySelector('#video-player');
      const videoUrl = workshop.workshop_video;
      const defaultOptions = {};

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
          const availableQualities = hls.levels.map((one) => one.height);
          defaultOptions.controls = [
            'play-large',
            'restart',
            'rewind',
            'play',
            'fast-forward',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen',
          ];
          defaultOptions.quality = {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (e) => updateQuality(e),
          };
          new Plyr(video, defaultOptions);
        });
        hls.attachMedia(video);
        window.hls = hls;
      }
      function updateQuality(newQuality) {
        window.hls.levels.forEach((level, levelIndex) => {
          if (level.height === newQuality) {
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    })
    .catch((error) => {});
}

// 찜하기
function addToWish() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');
  axios
    .post(`/api/workshops/${workshopId}/wish`) // user_id 임시로 하드코딩
    .then((res) => {
      alert(res.data.data.message);
      if (res.data.data.type === 'add') {
        document.querySelector('.wish').textContent = '♥';
      }
      if (res.data.data.type === 'remove') {
        document.querySelector('.wish').textContent = '♡';
      }
    })
    .catch((err) => {
      getErrorCode(
        err.response.data.statusCode,
        err.response.data.message,
        addToWish,
      );
    });
}

// 후기 불러오기
function getWorkshopReviews() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');

  axios
    .get(`/api/workshops/${workshopId}/reviews`) // user_id 임시로 하드코딩
    .then((res) => {
      const reviews = res.data.data;

      reviews.forEach((element, index) => {
        let TempReviews = `<div class="card mb-3" style="max-width: 700px; margin-top: 50px"><div class="row g-0">
          <div class="col-md-4 review-images">
            <img class="img-fluid rounded-start" alt="..." id="review-img-${
              index + 1
            }">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <p class="card-text">${element.content}</p>
              <p class="card-text">${element.star}점</p>
              <p class="card-text"><small class="text-muted">작성일: ${
                element.createdAt
              }</small></p>
            </div>
          </div>
        </div>
        </div>`;
        $('#workshop-reviews').append(TempReviews);

        if (element.reviewImage === null || element.reviewImage === '') {
          document.getElementById(`review-img-${index + 1}`).style.display =
            'none';
          return;
        }
        document.getElementById(`review-img-${index + 1}`).src =
          element.reviewImage;
      });
    })
    .catch((err) => {});
}

// 다음 지도 api
function findAddr() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
      // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var roadAddr = data.roadAddress; // 도로명 주소 변수
      var jibunAddr = data.jibunAddress; // 지번 주소 변수
      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById('zip-code').value = data.zonecode;
      if (roadAddr !== '') {
        document.getElementById('input-address').value = roadAddr;
      } else if (jibunAddr !== '') {
        document.getElementById('input_addr_detail').value = jibunAddr;
      }
    },
  }).open();
}

// 워크샵 문의 신청하기 - 제출하기 버튼
function orderWorkshop() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');

  const category = document.querySelector('.workshop-category').textContent;
  const company = document.getElementById('company').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  const phone_number = document.getElementById('phone_number').value;
  const wish_date = document.getElementById('wish_date').value;
  let wish_location =
    document.getElementById('input-address').value +
    ' ' +
    document.getElementById('input_addr_detail').value;
  const member_cnt = document.getElementById('member_cnt').value;
  const purpose = document.getElementById('purpose').value;
  const etc = document.getElementById('etc').value;

  if (
    !company ||
    !name ||
    !email ||
    !phone_number ||
    !wish_date ||
    !wish_location ||
    !purpose ||
    !member_cnt
  ) {
    alert('필수 입력 값을 모두 입력해주세요.');
    return;
  }

  // 이메일 정규표현식 검사
  const regEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  if (email !== null && regEmail.test(email) === false) {
    alert('이메일 형식이 올바르지 않습니다.');
    return;
  }

  // 전화번호 정규표현식 검사
  const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  if (phone_number !== null && regPhone.test(phone_number) === false) {
    alert('전화번호를 정확하게 입력해주세요.');
    return;
  }

  axios
    .post(`/api/workshops/${workshopId}/order`, {
      company,
      name,
      email,
      phone_number,
      member_cnt,
      wish_date,
      category,
      purpose,
      wish_location,
      etc,
    })
    .then((res) => {
      alert(res.data.data.message);
      location.href = '/mypage/workshops';
    })
    .catch((err) => {
      console.log(err);
      if (err.response.data.statusCode === 401) {
        alert('로그인 후 이용 가능합니다.');
      }
    });
}

// 에러 발생 시 상태 코드에 따른 로직 실행
const getErrorCode = async (statusCode, errorMessage, callback) => {
  if (statusCode === 400) {
    alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
    return;
  }
  if (statusCode === 401) {
    const refreshRes = await requestAccessToken();
    if (!refreshRes) {
      alert('로그인 후 이용 가능합니다.');
      return;
    }
    callback();
  }
};

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
