window.addEventListener('DOMContentLoaded', function () {
  getSoonWorkshops();
});

// 수강 예정 워크샵 불러오기
function getSoonWorkshops() {
  axios
    .get('/api/mypage/workshops/soon')
    .then((res) => {
      const workshops = res.data.data;
      console.log('workshops', workshops);

      workshops.forEach((element, index) => {
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
              <button id="open-order-input" onclick="tryWorkshopOrderInfo(${
                element.workshopDetailId
              })" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#order-input-modal">
              결제하기
              </button>
             <!-- 결제창 모달 삽입 위치였던 곳 -->
             <!-- 결제창 Modal -->
              <div class="modal fade" id="order-input-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">결제하기</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <!-- modal body-->
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                      <button type="button" class="btn btn-primary" onclick="open_iamport()">결제하기</button>
                    </div>
                  </div>
                </div>
              </div>
            <h5 class="card-title">${element.workshop_title}</h5>
            <p class="card-title">진행 예정일: ${
              element.workshopDetail_wish_date
            }</p>
            <p class="card-title">인원: ${
              element.workshopDetail_member_cnt
            }명</p>
            <p onclick="showModal(${
              element.workshopDetail_id
            })">상세 내역 보기</p>
          </div>
          <!-- 상세 내역 아코디언 창 -->
        </div>
      </div>`;
        $('#incomplete-list').append(tempHtml);
        showOrderBtn();
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// status가 '결제 대기중'일 때만 결제하기 버튼 보여주기
function showOrderBtn() {
  // iincomplete-list 요소 아래의 버튼 중 id가 open-order-input인 버튼을 선택
  const orderBtns = document.querySelectorAll(
    '#incomplete-list button[id="open-order-input"]',
  );
  // orderBtn 이전 형제 요소의 innerText 값을 status 변수에 할당
  orderBtns.forEach((orderBtn) => {
    const status = orderBtn.previousElementSibling.innerText;
    console.log(status);

    if (status !== '결제 대기중') {
      orderBtn.style.display = 'none';
    } else {
      orderBtn.style.display = 'block';
    }
  });
}

// $(document).on('shown.bs.modal', '#order-input-modal', showOrderBtn);

// 특정 워크샵 상세 내역 불러오기 (모달창)
function showModal(workshopDetailId) {
  axios
    .get(`/api/mypage/workshops/soon/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];
      console.log(workshop);

      const modal = document.getElementById('modal');
      modal.innerHTML = `<div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">워크샵 문의 상세 내역</h5>
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
                <div class="info-title">신청자: ${
                  workshop.workshopDetail_name
                } (${workshop.workshopDetail_company} /
        ${workshop.workshopDetail_email} /
        ${workshop.workshopDetail_phone_number})</div>
                <div class="info-ul">진행 예정일 :
                  <span class="info-li">${
                    workshop.workshopDetail_wish_date
                  }</span>
                </div>
                <div class="info-ul">인원 :
                  <span class="info-li">${
                    workshop.workshopDetail_member_cnt
                  }명</span>
                </div>
                <div class="info-ul">시간 :
                  <span class="info-li">${workshop.workshop_total_time}분</span>
                </div>
                <div class="info-ul">장소 :
                  <span class="info-li">${
                    workshop.workshop_category === 'online'
                      ? '온라인'
                      : `${workshop.workshopDetail_wish_location}`
                  }</span>
                </div>
                <div class="info-ul">목적 :
                  <span class="info-li">${
                    workshop.workshopDetail_purpose
                  }</span>
                </div>
                <div class="info-ul">기타 문의사항 :
                  <span class="info-li">${workshop.workshopDetail_etc}</span>
                </div>
                <div class="info-ul">강사 연락처 :
                  <span class="info-li">${workshop.teacherProfile_name} (${
        workshop.teacherProfile_phone_number
      })</span>
                </div>
                <div class="info-price">총 금액: ${
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
function tryWorkshopOrderInfo(workshopDetailId) {
  axios
    .post(`/api/mypage/workshops/soon/${workshopDetailId}`)
    .then((res) => {
      const workshop = res.data.data[0];
      console.log(workshop);
    })
    .catch((err) => {
      console.log(err);
    });
  const modal = document.getElementById('modal');

  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = `<form id="form">
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
        <div class="mb-3" >
          <p>워크샵 id: <span id="order-workshop-id">${
            element.workshop_id
          }</span></p>
        </div>
        <div class="mb-3">
          <p>워크샵 주문 번호: <span id="order-workshopDetail-id">${
            element.workshopDetail_id
          }</span></p>
        </div>
        <div class="mb-3">
          <p>워크샵 제목: <span id="order-workshop-title">${
            element.workshop_title
          }</span></p>
        </div>
        <div class="mb-3">
          <p>총 결제 금액 <span id="order-price">${
            element.workshop_price * element.workshopDetail_member_cnt
          }</span>원</p>
        </div>`;
}

// 아임포트 창 열기
function open_iamport() {
  const title = document.querySelector('#order-workshop-title').innerText;
  // const price = document.querySelector('#order-price').innerText;
  const price = 100; // 일단 임시로 100원 결제
  const merchant_uid = document.querySelector('#order-workshop-id').innerText;
  const buyer_email = document.querySelector('#email').value; // 구매자 이메일
  const buyer_name = document.querySelector('#name').value; // 구매자 이름
  const buyer_tel = document.querySelector('#phone_number').value; // 구매자 전화번호
  const buyer_addr = document.querySelector('#address').value; // 구매자 주소
  const buyer_postcode = document.querySelector('#zip-code').value; // 주문자 우편번호
  const workshopInstanceId = document.querySelector(
    '#order-workshopDetail-id',
  ).innerText;

  // imp 객체 가져오기
  const IMP = window.IMP;
  IMP.init('imp85074462');
  IMP.request_pay(
    {
      pg: 'html5_inicis', // 하나의 아임포트 계정으로 여러 pg를 사용할 때 구분자
      pay_method: 'card', // 결제 수단
      merchant_uid, // workshop_id
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
          .post('/api/mypage/workshop/order', {
            workshopInstanceId,
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
          })
          .then((response) => {
            alert(response.message);
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log(rsp);
        console.log('결제 실패');
      }
    },
  );
}

// <div class="accordion accordion-flush" id="accordionFlushExample">
//             <div class="accordion-item">
//               <h2 class="accordion-header" id="flush-headingOne">
//                 <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
//                   상세 내역 보기
//                 </button>
//               </h2>
//               <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
//                 <div class="accordion-body-${index}">
//                 <p>신청 번호: ${element.workshopDetail_id}</p>
//                 <p>워크샵 제목: ${element.workshop_title}</p>
//                 <p>회사명: ${element.workshopDetail_company}</p>
//                 <p>신청자 이름: ${element.workshopDetail_name}</p>
//                 <p>신청자 이메일: ${element.workshopDetail_email}</p>
//                 <p>휴대폰 번호: ${element.workshopDetail_phone_number}</p>
//                 <p>진행 일자: ${element.workshopDetail_wish_date}</p>
//                 <p>신청 목적: ${element.workshopDetail_purpose}</p>
//                 <p>신청 유형: ${element.workshop_category}</p>
//                 <p>장소: ${element.workshopDetail_wish_location}</p>
//                 <p>인원: ${element.workshopDetail_member_cnt}</p>
//                 <p>기타 문의 사항: ${element.workshopDetail_etc}</p>
//                 <p>강사 연락처: ${element.teacher_email}</p></div>
//               </div>
//             </div>
//           </div>
