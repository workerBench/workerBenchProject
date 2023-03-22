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
      console.log('workshops', workshops);

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
        <a href="/workshops/detail?workshopId=${
          element.workshop_id
        }"><img src="${
          element.workshop_thumb
        }" class="card-img-top" alt="..." /></a>
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
    .catch((error) => {
      console.log(error);
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
      console.log(workshop);

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
        workshop.workshop_thumb
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
    .catch((err) => {
      console.log(err);
    });
}

// 결제하기 버튼 클릭 시 모달 창 불러오기
function putWorkshopOrderInfo(workshopDetailId) {
  axios
    .post(`/api/mypage/workshops/orderInfo`, { workshopDetailId })
    .then((res) => {
      console.log(res);
      console.log(workshopDetailId, '결제 입력창 열기');
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
        <input type="text" class="form-control" name="name" id="name" placeholder="구매자 이름" required>
      </div>
      <div class="mb-3">
        <input type="email" class="form-control" name="email" id="email" placeholder="이메일" required>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" name="phone_number" id="phone_number" placeholder="전화번호" required>
        <p>* '-' 없이 입력해주세요. (ex. 01012341234)</p>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" name="phone_number" id="address" placeholder="주소" required>
      </div>
      <div class="mb-3">
        <input type="text" class="form-control" name="phone_number" id="zip-code" placeholder="우편번호" required>
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
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
      location.reload();
    });
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
  const buyer_addr = document.querySelector('#address').value; // 구매자 주소
  const buyer_postcode = document.querySelector('#zip-code').value; // 주문자 우편번호
  const workshopInstance_id = document.querySelector(
    '#order-workshopDetail-id',
  ).innerText;

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
        console.log(rsp);

        axios
          .patch('/api/mypage/workshops/order', {
            workshopInstance_id,
            workshop_id,
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
          })
          .then((response) => {
            console.log(response);
            alert('결제가 완료되었습니다.');
            location.href = '/mypage/workshops';
          })
          .catch((error) => {
            console.log(error);
            alert(error.message / error.response.data.message);
          });
      } else {
        console.log(rsp);
        alert('결제가 실패했습니다.');
      }
    },
  );
}

// 환불하기 버튼 클릭 시 모달 창 불러오기
function putWorkshopRefundInfo(workshopDetailId) {
  axios
    .post(`/api/mypage/workshops/refundInfo`, { workshopDetailId })
    .then((res) => {
      console.log(res);
      console.log(workshopDetailId, '환불 입력창 열기');
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
    .catch((err) => {
      console.log(err);
      alert(err.response.data.message);
      location.reload();
    });
}

// 아임포트 환불 요청하기
function cancel_pay() {
  const merchant_uid = document.getElementById('order-merchant-id').innerText;
  const amount = document.getElementById('refund-workshop-price').innerText;
  const reason = document.getElementById('reason').value;
  const workshop_id = document.getElementById('order-workshop-id').innerText;
  const workshopInstance_id = document.getElementById(
    'order-workshopDetail-id',
  ).innerText;

  if (!reason) {
    return alert('환불 사유를 입력해주세요.');
  }
  confirm('결제를 취소하시겠습니까?');

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
      console.log(response);
      alert('결제 취소가 완료되었습니다.');
      location.reload();
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// 수강 완료 워크샵 전체 목록 불러오기
function getCompleteWorkshops() {
  axios
    .get('/api/mypage/workshops/complete')
    .then((res) => {
      const workshops = res.data.data;
      console.log('1111');
      console.log('workshops', workshops);

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
        <div id="workshopDetail-id" style="display:none;">${element.workshopDetail_id}</div>
        <a href="/workshops/detail?workshopId=${element.workshop_id}"><img src="${element.workshop_thumb}" class="card-img-top" alt="..." /></a>
          <div class="card-body">
            <h5 id="card-workshop-title">${element.workshop_title}</h5>
            <p class="card-workshop-summary">진행 예정일: ${element.workshopDetail_wish_date}</p>
            <p class="card-workshop-summary">인원: ${element.workshopDetail_member_cnt}명</p>
            <p id="show-workshop-detail" data-bs-toggle="modal" onclick="showCompleteModal(${element.workshopDetail_id})">상세 내역 보기 >> </p>
          </div>
        </div>
      </div>`;
        $('#complete-list').append(tempHtml);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// 특정 워크샵 상세 내역 불러오기 (모달창) - 수강 완료
function showCompleteModal(workshopDetailId) {
  axios
    .get(`/api/mypage/workshops/complete/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];
      console.log(workshop);

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
        workshop.workshop_thumb
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
    .catch((err) => {
      console.log(err);
    });
}

// 수강 취소 워크샵 전체 목록 불러오기
function getRefundWorkshops() {
  axios
    .get('/api/mypage/workshops/refund')
    .then((res) => {
      const workshops = res.data.data;
      console.log('workshops', workshops);

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
        <a href="/workshops/detail?workshopId=${element.workshop_id}"><img src="${element.workshop_thumb}" class="card-img-top" alt="..." /></a>
          <div class="card-body">
            <h5 id="card-workshop-title">${element.workshop_title}</h5>
            <p class="card-workshop-summary">진행 예정일: ${element.workshopDetail_wish_date}</p>
            <p class="card-workshop-summary">인원: ${element.workshopDetail_member_cnt}명</p>
            <p id="show-workshop-detail" data-bs-toggle="modal" onclick="showRefundModal(${element.workshopDetail_id})">상세 내역 보기 >> </p>
          </div>
        </div>
      </div>`;
        $('#refund-list').append(tempHtml);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// 특정 워크샵 상세 내역 불러오기 (모달창) - 수강 취소
function showRefundModal(workshopDetailId) {
  axios
    .get(`/api/mypage/workshops/refund/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];
      console.log(res);

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
        workshop.workshop_thumb
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
    .catch((err) => {
      console.log(err);
    });
}
