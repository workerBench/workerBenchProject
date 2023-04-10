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
  getSoonWorkshops();
  getCompleteWorkshops();
  getRefundWorkshops();
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

// 수강 예정 워크샵 불러오기
function getSoonWorkshops() {
  axios
    .get('/api/mypage/workshops/soon')
    .then((res) => {
      const workshops = res.data.data;

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
        <a href="/workshops/detail?workshopId=${
          element.workshop_id
        }"><img src="${element.thumbUrl}" class="card-img-top" alt="..." /></a>
          <div class="card-body">
            <button id="show-status"
                type="button"
                class="btn btn-outline-primary"
                disabled
              >
                ${
                  element.workshopDetail_status == 'request'
                    ? '강사 수락 대기 중'
                    : element.workshopDetail_status == 'non_payment'
                    ? '결제 대기중'
                    : element.workshopDetail_status == 'waiting_lecture'
                    ? '결제 완료'
                    : 0
                }
              </button>
              <button id="open-order-input" onclick="putWorkshopOrderInfo(${
                element.workshopDetail_id
              })" type="button" class="btn btn-primary open-order-input" data-bs-toggle="modal" data-bs-target="#order-input-modal">
              ${
                element.workshopDetail_status == 'non_payment'
                  ? '결제하기'
                  : '결제 불가'
              }
              </button>
              <button id="open-refund-input" onclick="putWorkshopRefundInfo(${
                element.workshopDetail_id
              })" type="button" class="btn btn-secondary open-refund-input" data-bs-toggle="modal">${
          element.workshopDetail_status == 'waiting_lecture'
            ? '환불하기'
            : '환불 불가'
        }</button>
             <!-- 결제창 Modal -->
            <h5 id="card-workshop-title">${element.workshop_title}</h5>
            <p class="card-workshop-summary">진행 예정일: ${
              element.workshopDetail_wish_date
            }</p>
            <p class="card-workshop-summary">인원: ${
              element.workshopDetail_member_cnt
            }명</p>
            <p id="show-workshop-detail" data-bs-toggle="modal" onclick="showIncompleteModal(${
              element.workshopDetail_id
            })">상세 내역 보기 >> </p>
          </div>
        </div>
      </div>`;
        $('#incomplete-list').append(tempHtml);
      });
      hideButtonIfNotPayable();
      hideButtonIfNotRefundable();
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getSoonWorkshops();
      }
    });
}

// 결제 상태에 따라 결제하기 버튼 숨기기
function hideButtonIfNotPayable() {
  const buttons = document.querySelectorAll('.open-order-input');

  buttons.forEach((button) => {
    if (button.textContent.trim() === '결제 불가') {
      button.style.display = 'none';
    }
  });
}

// 환불 가능 여부에 따라 환불하기 버튼 숨기기
function hideButtonIfNotRefundable() {
  const buttons = document.querySelectorAll('.open-refund-input');

  buttons.forEach((button) => {
    if (button.textContent.trim() === '환불 불가') {
      button.style.display = 'none';
    }
  });
}

// 특정 워크샵 상세 내역 불러오기 (모달창) - 수강 예정
function showIncompleteModal(workshopDetailId) {
  axios
    .get(`/api/mypage/workshops/soon/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];
      const modal = document.getElementById('modal');
      modal.innerHTML = `
            <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">워크샵 문의 상세 내역</h5>
              <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <a href="/workshops/detail?workshopId=${
                workshop.workshop_id
              }"><img src="${
        workshop.thumbUrl
      }" alt="Image" class="modal-image"></a>
              <div class="info">
                <div class="info-category">${
                  workshop.workshop_category === 'online'
                    ? '온라인'
                    : '오프라인'
                }</div>
                <div class="info-title">${workshop.workshop_title}</div>
                <div class="info-ul">신청자: <span class="info-li">${
                  workshop.workshopDetail_name
                } (${workshop.workshopDetail_company} /
        ${workshop.workshopDetail_email} /
        ${workshop.workshopDetail_phone_number})</span></div>
                <div class="info-ul">진행 예정일:
                  <span class="info-li">${
                    workshop.workshopDetail_wish_date
                  }</span>
                </div>
                <div class="info-ul">인원:
                  <span class="info-li">${
                    workshop.workshopDetail_member_cnt
                  }명</span>
                </div>
                <div class="info-ul">시간:
                  <span class="info-li">${workshop.workshop_total_time}분</span>
                </div>
                <div class="info-ul">장소:
                  <span class="info-li">${
                    workshop.workshop_category === 'online'
                      ? '온라인'
                      : `${workshop.workshopDetail_wish_location}`
                  }</span>
                </div>
                <div class="info-ul">목적:
                  <span class="info-li">${
                    workshop.workshopDetail_purpose
                  }</span>
                </div>
                <div class="info-ul">기타 문의사항:
                  <span class="info-li">${workshop.workshopDetail_etc}</span>
                </div>
                <div class="info-ul">강사 연락처:
                  <span class="info-li">${workshop.teacherProfile_name} (${
        workshop.teacherProfile_phone_number
      })</span>
                </div>
                <div class="info-price">총 결제 금액: ${
                  workshop.workshop_price * workshop.workshopDetail_member_cnt
                }원</div>
              </div>
            </div>
          </div>
      `;

      modal.classList.add('show');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('style', 'display: block');

      const closeButton = modal.querySelector('.btn-close');
      closeButton.addEventListener('click', function () {
        modal.classList.remove('show');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
      });

      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('style');
        }
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        showIncompleteModal(workshopDetailId);
      }
    });
}

// 결제하기 버튼 클릭 시 모달 창 불러오기
function putWorkshopOrderInfo(workshopDetailId) {
  axios
    .post(`/api/mypage/workshops/orderInfo`, { workshopDetailId })
    .then((res) => {
      const workshop = res.data.data[0];

      const modal = document.getElementById('modal');
      modal.innerHTML = `<div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">구매자 정보 입력하기</h5>
        <button type="button" class="btn-close" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <form id="form">
      <p>상품 번호: <span id="order-workshop-id">${
        workshop.workshop_id
      }</span></p>
      <p>상품 명: <span id="order-workshop-title">${
        workshop.workshop_title
      }</span></p>
      <p>주문 번호: <span id="order-workshopDetail-id">${
        workshop.workshopDetail_id
      }</span></p>
      <p>총 결제 금액: <span id="order-workshop-price">${
        workshop.workshop_price * workshop.workshopDetail_member_cnt
      }원</span></p>
      <div class="mb-3">
        <input type="text" class="form-control" name="name" id="name" placeholder="이름" required>
      </div>
      <div class="mb-3">
        <input type="email" class="form-control" name="email" id="email" placeholder="이메일" required>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" name="phone_number" id="phone_number" placeholder="전화번호 (- 없이 입력해주세요.)" required>
      </div>
      <div class="mb-3" id="address">
      <input id="zip-code"  class="form-control" type="text" placeholder="우편번호 검색" readonly onclick="findAddr()"> <br>
      <input id="input-address" class="form-control" type="text" placeholder="주소 (필수) (우편번호를 검색해주세요.)" readonly> <br>
      <input id="input_addr_detail" class="form-control" type="text" placeholder="상세 주소">
    </div>
      <button type="button" class="btn btn-primary" onclick="open_iamport()">결제하기</button>
      </div>
    </div>`;

      modal.classList.add('show');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('style', 'display: block');

      const closeButton = modal.querySelector('.btn-close');
      closeButton.addEventListener('click', function () {
        modal.classList.remove('show');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
      });

      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('style');
        }
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        putWorkshopOrderInfo(workshopDetailId);
      }
    });
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

// 아임포트 결제 창 열기
function open_iamport() {
  const title = document.querySelector('#order-workshop-title').innerText;
  // const price = document.querySelector('#order-price').innerText;
  const price = 100; // 일단 임시로 100원 결제
  const workshop_id = document.querySelector('#order-workshop-id').innerText;
  const buyer_email = document.querySelector('#email').value; // 구매자 이메일
  const buyer_name = document.querySelector('#name').value; // 구매자 이름
  const buyer_tel = document.querySelector('#phone_number').value; // 구매자 전화번호
  const buyer_addr =
    document.querySelector('#input-address').value +
    ' ' +
    document.querySelector('#input_addr_detail').value; // 구매자 주소
  const buyer_postcode = document.querySelector('#zip-code').value; // 주문자 우편번호
  const workshopInstance_id = document.querySelector(
    '#order-workshopDetail-id',
  ).innerText;

  if (!buyer_name || !buyer_addr || !buyer_postcode) {
    alert('필수 입력 값을 모두 입력해주세요.');
    return;
  }

  // 이메일 정규표현식 검사
  const regEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  if (buyer_email !== null && regEmail.test(buyer_email) === false) {
    alert('이메일 형식이 올바르지 않습니다.');
    return;
  }

  // 전화번호 정규표현식 검사
  const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  if (buyer_tel !== null && regPhone.test(buyer_tel) === false) {
    alert('전화번호를 정확하게 입력해주세요.');
    return;
  }

  // merchant_uid 만들기
  function make_merchant_uid() {
    const current_time = new Date();
    const year = current_time.getFullYear().toString();
    const month = (current_time.getMonth() + 1).toString();
    const day = current_time.getDate().toString();
    const hour = current_time.getHours().toString();
    const minute = current_time.getMinutes().toString();
    const second = current_time.getSeconds().toString();

    const auth_num = Math.floor(Math.random() * 16777215).toString(16);
    const merchant_uid = auth_num + year + month + day + hour + minute + second;
    return merchant_uid;
  }

  // imp 객체 가져오기
  const IMP = window.IMP;
  IMP.init('imp31720762');
  IMP.request_pay(
    {
      pg: 'html5_inicis', // 하나의 아임포트 계정으로 여러 pg를 사용할 때 구분자
      pay_method: 'card', // 결제 수단
      merchant_uid: make_merchant_uid(),
      name: title,
      amount: Number(price), // 결제할 금액
      buyer_email, // 구매자 이메일
      buyer_name, // 구매자 이름
      buyer_tel, // 구매자 전화번호
      buyer_addr, // 구매자 주소
      buyer_postcode, // 주문자 우편번호
    },
    function (rsp) {
      if (rsp.success) {
        recordOrder(workshopInstance_id, workshop_id, rsp);
      } else {
        alert('결제가 실패했습니다.');
      }
    },
  );
}

// 결제 성공 시 실행할 함수
function recordOrder(workshopInstance_id, workshop_id, rsp) {
  axios
    .patch('/api/mypage/workshops/order', {
      workshopInstance_id,
      workshop_id,
      imp_uid: rsp.imp_uid,
      merchant_uid: rsp.merchant_uid,
    })
    .then((response) => {
      alert('결제가 완료되었습니다.');
      location.href = '/mypage/workshops';
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        recordOrder(workshopInstance_id, workshop_id, rsp);
      }
    });
}

// 환불하기 버튼 클릭 시 모달 창 불러오기
function putWorkshopRefundInfo(workshopDetailId) {
  axios
    .post(`/api/mypage/workshops/refundInfo`, { workshopDetailId })
    .then((res) => {
      const workshop = res.data.data[0];

      const modal = document.getElementById('refund-modal');
      modal.innerHTML = `<div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">환불 정보 입력하기</h5>
          <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <form id="form">
        <p>상품 번호: <span id="order-workshop-id">${
          workshop.workshop_id
        }</span></p>
        <p>상품 명: <span id="order-workshop-title">${
          workshop.workshop_title
        }</span></p>
        <p>신청 번호: <span id="order-workshopDetail-id">${
          workshop.workshopDetail_id
        }</span></p>
        <p>주문 번호: <span id="order-merchant-id">${
          workshop.order_merchant_uid
        }</span></p>
        <p>총 환불 금액: <span id="refund-workshop-price">${
          workshop.workshop_price * workshop.workshopDetail_member_cnt
        }</span>원</p>
        <div class="mb-3">
          <input type="text" class="form-control" name="name" id="reason" placeholder="환불 사유" required>
        </div>
        <button type="button" class="btn btn-primary" onclick="cancel_pay()">환불하기</button>
        </div>
      </div>`;

      modal.classList.add('show');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('style', 'display: block');

      const closeButton = modal.querySelector('.btn-close');
      closeButton.addEventListener('click', function () {
        modal.classList.remove('show');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
      });

      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('style');
        }
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        putWorkshopRefundInfo(workshopDetailId);
      }
    });
}

// 아임포트 환불 요청하기
function cancel_pay(retry = false) {
  const merchant_uid = document.getElementById('order-merchant-id').innerText;
  const amount = document.getElementById('refund-workshop-price').innerText;
  const reason = document.getElementById('reason').value;
  const workshop_id = document.getElementById('order-workshop-id').innerText;
  const workshopInstance_id = document.getElementById(
    'order-workshopDetail-id',
  ).innerText;

  if (!reason) {
    alert('환불 사유를 입력해주세요.');
    return;
  }

  if (retry === false) {
    const result = confirm('결제를 취소하시겠습니까?');
    if (result === false) {
      return;
    }
  }

  $.ajax({
    type: 'POST',
    url: '/api/mypage/workshops/order/refund',
    // 예: http://www.myservice.com/payments/cancel
    data: {
      workshopInstance_id,
      workshop_id,
      merchant_uid: String(merchant_uid), // 예: ORD20180131-0000011
      cancel_request_amount: 100, // 환불금액 (100원으로 고정)
      reason: reason, // 환불사유
    },
    success: function (response) {
      alert('결제 취소가 완료되었습니다.');
      location.reload();
    },
    error: async function (error) {
      const result = await getErrorCode(
        error.responseJSON.statusCode,
        error.responseJSON.message,
      );
      if (result) {
        cancel_pay(true);
      }
    },
  });
}

// 수강 완료 워크샵 전체 목록 불러오기
function getCompleteWorkshops() {
  axios
    .get('/api/mypage/workshops/complete')
    .then((res) => {
      const workshops = res.data.data;

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
          <div class="card h-100">
            <a href="/workshops/detail?workshopId=${element.workshop_id}"><img src="${element.thumbUrl}" class="card-img-top" alt="..." /></a>
              <div class="card-body">
                <h5 id="card-workshop-title">${element.workshop_title}</h5>
                <p class="card-workshop-summary">진행일: ${element.workshopDetail_wish_date}</p>
                <p class="card-workshop-summary">인원: ${element.workshopDetail_member_cnt}명</p>
                <p id="show-workshop-detail" data-bs-toggle="modal" onclick="showCompleteModal(${element.workshopDetail_id})">상세 내역 보기 >> </p>
                <button class="btn btn-primary" onclick="showReviewPost(${element.workshop_id}, ${element.workshopDetail_id})">리뷰 작성하기</button>
              </div>
            </div>
          </div>`;
        $('#complete-list').append(tempHtml);
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getCompleteWorkshops();
      }
    });
}

// 특정 워크샵 상세 내역 불러오기 (모달창) - 수강 완료
function showCompleteModal(workshopDetailId) {
  axios
    .get(`/api/mypage/workshops/complete/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];

      const modal = document.getElementById('modal');
      modal.innerHTML = `
            <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">워크샵 문의 상세 내역</h5>
              <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <a href="/workshops/detail?workshopId=${
                workshop.workshop_id
              }"><img src="${
        workshop.thumbUrl
      }" alt="Image" class="modal-image"></a>
              <div class="info">
                <div class="info-category">${
                  workshop.workshop_category === 'online'
                    ? '온라인'
                    : '오프라인'
                }</div>
                <div class="info-title">${workshop.workshop_title}</div>
                <div class="info-ul">신청자: <span class="info-li">${
                  workshop.workshopDetail_name
                } (${workshop.workshopDetail_company} /
        ${workshop.workshopDetail_email} /
        ${workshop.workshopDetail_phone_number})</span></div>
                <div class="info-ul">진행일:
                  <span class="info-li">${
                    workshop.workshopDetail_wish_date
                  }</span>
                </div>
                <div class="info-ul">인원:
                  <span class="info-li">${
                    workshop.workshopDetail_member_cnt
                  }명</span>
                </div>
                <div class="info-ul">시간:
                  <span class="info-li">${workshop.workshop_total_time}분</span>
                </div>
                <div class="info-ul">장소:
                  <span class="info-li">${
                    workshop.workshop_category === 'online'
                      ? '온라인'
                      : `${workshop.workshopDetail_wish_location}`
                  }</span>
                </div>
                <div class="info-ul">목적:
                  <span class="info-li">${
                    workshop.workshopDetail_purpose
                  }</span>
                </div>
                <div class="info-ul">기타 문의사항:
                  <span class="info-li">${workshop.workshopDetail_etc}</span>
                </div>
                <div class="info-ul">강사 연락처:
                  <span class="info-li">${workshop.teacherProfile_name} (${
        workshop.teacherProfile_phone_number
      })</span>
                </div>
                <div class="info-price">총 결제 금액: ${
                  workshop.workshop_price * workshop.workshopDetail_member_cnt
                }원</div>
              </div>
            </div>
          </div>
      `;

      modal.classList.add('show');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('style', 'display: block');

      const closeButton = modal.querySelector('.btn-close');
      closeButton.addEventListener('click', function () {
        modal.classList.remove('show');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
      });

      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('style');
        }
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        showCompleteModal(workshopDetailId);
      }
    });
}

// ------------------------------- 리뷰 작성 모달창 ------------------------------- //

function showReviewPost(workshop_id, workshopInstanceDetail_id) {
  const modal = document.getElementById('review-modal');
  modal.innerHTML = `
  <div class="modal-review-content">
    <div class="modal-header">
      <h5 class="modal-title">리뷰 작성하기</h5>
      <button type="button" class="btn-close" aria-label="Close"></button>
    </div>
    <div class="modal-review-body">
        <div id="thumb-img-wrap">
          <img class="modal-review-image" id="thumb-img-show" >
          <div>
            <input type="file" accept="image/*" , id="thumb-img-file" />
          </div>
        </div>
        <div class="rating-review">
          <form class="mb-3" name="myform" id="myform" method="post">
            <fieldset>
              <span class="text-bold">별점을 선택해주세요</span>
              <input type="radio" name="reviewStar" value="5" id="rate1"><label
                for="rate1">★</label>
              <input type="radio" name="reviewStar" value="4" id="rate2"><label
                for="rate2">★</label>
              <input type="radio" name="reviewStar" value="3" id="rate3"><label
                for="rate3">★</label>
              <input type="radio" name="reviewStar" value="2" id="rate4"><label
                for="rate4">★</label>
              <input type="radio" name="reviewStar" value="1" id="rate5"><label
                for="rate5">★</label>
            </fieldset>
            <div>
              <textarea type="text" id="reviewContents"
                    placeholder="리뷰를 작성해주세요!"></textarea>
            </div>
          </form>	
        </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" id="post-review" onclick="submitReview(${workshop_id}, ${workshopInstanceDetail_id})">작성하기</button>
    </div>
  </div>
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('style', 'display: block');

  const closeButton = modal.querySelector('.btn-close');
  closeButton.addEventListener('click', function () {
    modal.classList.remove('show');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('style');
  });

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.classList.remove('show');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('style');
    }
  });

  // -------------------------- 리뷰 수정 모달창 이미지 미리보기 (2) -------------------------- //
  const thumbImg = document.querySelector('#thumb-img-file');
  thumbImg.addEventListener('change', function (event) {
    let files = event.target.files;
    if (files.length >= 1) {
      const imgShow = document.querySelector('#thumb-img-show');
      const reader = new FileReader();
      reader.addEventListener('load', function (event) {
        imgShow.src = reader.result;
      });
      reader.readAsDataURL(files[0]);
    }
    if (!files.length) {
      const imgShow = document.querySelector(`#thumb-img-show`);
      imgShow.removeAttribute('src');
    }
  });
}

// --------------------------------- 리뷰 수정 모달창 이미지 미리보기 --------------------------------- //

// input 요소에서 파일이 선택되면 실행되는 함수
// function previewImage(event) {
//   // input 요소에서 선택된 파일 가져오기
//   const input = event.target;
//   const file = input.files[0];

//   // FileReader 객체를 사용하여 파일을 읽기
//   const reader = new FileReader();

//   // 파일이 로드되면 실행되는 함수
//   reader.onload = function () {
//     // 미리보기 이미지 요소 가져오기
//     const img = document.querySelector('.modal-update-image');
//     // 미리보기 이미지 요소에 이미지 데이터 설정
//     img.src = reader.result;
//   };

//   // 파일 읽기 시작
//   reader.readAsDataURL(file);
// }

// // input 요소에 이벤트 리스너 등록
// const input = document.querySelector('#thumb-img-file');
// input.addEventListener('change', previewImage);

// -------------------------------- 워크샵 리뷰 모달창 수정하기 버튼 -------------------------------- //

const submitReview = async (workshop_id, workshopInstanceDetail_id) => {
  const starValue = parseInt($('input[name="reviewStar"]:checked').val());
  const reviewContent = $('#reviewContents').val();

  if (!starValue) {
    alert('별점을 입력해주세요!');
    return;
  }
  if (!reviewContent) {
    alert('리뷰 내용을 입력해주세요!');
    return;
  }

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/mypage/workshops/review',
      data: {
        content: reviewContent,
        star: starValue,
        workshop_id: workshop_id,
        workshop_instance_detail_id: workshopInstanceDetail_id,
      },
    });
    checkAndSendingImage(res.data.data);
  } catch (error) {
    const result = await getErrorCode(
      error.response.data.statusCode,
      error.response.data.message,
    );
    if (result) {
      submitReview(workshop_id, workshopInstanceDetail_id);
    }
    if (!result) {
      location.reload();
    }
  }
};

// 리뷰 작성 시 이미지(썸네일)가 있다면 이미지 또한 업로드
const checkAndSendingImage = (reviewId) => {
  // 우선 리뷰 썸네일이 등록되어 있는지 확인.
  const thumbImg = document.querySelector('#thumb-img-file').files;
  if (thumbImg.length < 1) {
    alert('리뷰 작성이 완료되었습니다.');
    location.reload();
    return;
  }

  // 사진 용량이 5MB 를 넘을 경우 과용량이라며 리턴
  if (thumbImg.size > 10 * 1024 * 1024) {
    alert('사진의 용량이 너무 큽니다. 최다 10MB 이하의 사진을 사용해 주세요');
    return;
  }

  // 썸네일도 등록되어 있고, 사진 용량도 문제 없다면 업로드
  const formData = new FormData();
  formData.append('image', thumbImg[0]);
  formData.append('reviewId', reviewId);

  axios({
    method: 'post',
    url: '/api/mypage/workshops/review/image',
    data: formData,
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
    .then((res) => {
      alert('리뷰 작성이 완료되었습니다.');
      location.reload();
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        checkAndSendingImage(reviewId);
      }
      if (!result) {
        location.reload();
      }
    });
};

// 수강 취소 워크샵 전체 목록 불러오기
function getRefundWorkshops() {
  axios
    .get('/api/mypage/workshops/refund')
    .then((res) => {
      const workshops = res.data.data;

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
        <a href="/workshops/detail?workshopId=${
          element.workshop_id
        }"><img src="${element.thumbUrl}" class="card-img-top" alt="..." /></a>
          <div class="card-body">
          <button id="show-status"
                type="button"
                class="btn btn-outline-primary"
                disabled
              >
                ${
                  element.workshopDetail_status == 'refund'
                    ? '환불 완료'
                    : '문의 취소'
                }
              </button>
            <h5 id="card-workshop-title">${element.workshop_title}</h5>
            <p class="card-workshop-summary">진행 예정일: ${
              element.workshopDetail_wish_date
            }</p>
            <p class="card-workshop-summary">인원: ${
              element.workshopDetail_member_cnt
            }명</p>
            <p id="show-workshop-detail" data-bs-toggle="modal" onclick="showRefundModal(${
              element.workshopDetail_id
            })">상세 내역 보기 >> </p>
          </div>
        </div>
      </div>`;
        $('#refund-list').append(tempHtml);
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getRefundWorkshops();
      }
    });
}

// 특정 워크샵 상세 내역 불러오기 (모달창) - 수강 취소
function showRefundModal(workshopDetailId) {
  axios
    .get(`/api/mypage/workshops/refund/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];

      const modal = document.getElementById('modal');
      modal.innerHTML = `
            <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">워크샵 문의 상세 내역</h5>
              <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <a href="/workshops/detail?workshopId=${
                workshop.workshop_id
              }"><img src="${
        workshop.thumbUrl
      }" alt="Image" class="modal-image"></a>
              <div class="info">
                <div class="info-category">${
                  workshop.workshop_category === 'online'
                    ? '온라인'
                    : '오프라인'
                }</div>
                <div class="info-title">${workshop.workshop_title}</div>
                <div class="info-ul">신청자: <span class="info-li">${
                  workshop.workshopDetail_name
                } (${workshop.workshopDetail_company} /
        ${workshop.workshopDetail_email} /
        ${workshop.workshopDetail_phone_number})</span></div>
                <div class="info-ul">진행 예정일:
                  <span class="info-li">${
                    workshop.workshopDetail_wish_date
                  }</span>
                </div>
                <div class="info-ul">인원:
                  <span class="info-li">${
                    workshop.workshopDetail_member_cnt
                  }명</span>
                </div>
                <div class="info-ul">시간:
                  <span class="info-li">${workshop.workshop_total_time}분</span>
                </div>
                <div class="info-ul">장소:
                  <span class="info-li">${
                    workshop.workshop_category === 'online'
                      ? '온라인'
                      : `${workshop.workshopDetail_wish_location}`
                  }</span>
                </div>
                <div class="info-ul">목적:
                  <span class="info-li">${
                    workshop.workshopDetail_purpose
                  }</span>
                </div>
                <div class="info-ul">기타 문의사항:
                  <span class="info-li">${workshop.workshopDetail_etc}</span>
                </div>
                <div class="info-ul">강사 연락처:
                  <span class="info-li">${workshop.teacherProfile_name} (${
        workshop.teacherProfile_phone_number
      })</span>
                </div>
                <div class="info-price">총 결제 금액: ${
                  workshop.workshop_price * workshop.workshopDetail_member_cnt
                }원</div>
              </div>
            </div>
          </div>
      `;

      modal.classList.add('show');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('style', 'display: block');

      const closeButton = modal.querySelector('.btn-close');
      closeButton.addEventListener('click', function () {
        modal.classList.remove('show');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
      });

      modal.addEventListener('click', function (event) {
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('style');
        }
      });
    })
    .catch(async (error) => {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        showRefundModal(workshopDetailId);
      }
    });
}
