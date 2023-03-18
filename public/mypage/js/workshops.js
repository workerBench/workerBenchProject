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

      workshops.forEach((element) => {
        let tempHtml = `<div class="col">
        <div class="card h-100">
          <img src="..." class="card-img-top" alt="..." />
          <div class="card-body">
            <p>
              <button
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
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#order-input-modal">
              결제하기
              </button>
              <!-- 결제창 Modal -->
              <div class="modal fade" id="order-input-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">결제하기</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <form id="form">
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
                        element.workshop_price *
                        element.workshopDetail_member_cnt
                      }</span>원</p>
                    </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                      <button type="button" class="btn btn-primary" onclick="open_iamport(${
                        element.workshop_id
                      })">결제하기</button>
                    </div>
                  </div>
                </div>
              </div>
            </p>
            <h5 class="card-title">${element.workshop_title}</h5>
            <p class="card-title">진행 예정일: ${
              element.workshopDetail_wish_date
            }</p>
            <p class="card-title">인원: ${
              element.workshopDetail_member_cnt
            }명</p>
            <p
              class="detail-modal"
              data-bs-toggle="modal"
              data-bs-target="#reservation-detail-Modal"
            >
              상세 내역 보기
            </p>
          </div>
          <!-- 상세 내역 Modal -->
          <div
            class="modal fade"
            id="reservation-detail-Modal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    워크샵 예약 상세 내역
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <p>워크샵 타이틀: ${element.workshop_title}</p>
                  <p>회사명:${element.workshopDetail_company}</p>
                  <p>신청자 이름: ${element.workshopDetail_name}</p>
                  <p>신청자 이메일: ${element.workshopDetail_email}</p>
                  <p>휴대폰 번호:${element.workshopDetail_phone_number}</p>
                  <p>진행 일자:${element.workshopDetail_wish_date}</p>
                  <p>신청 목적:${element.workshopDetail_purpose}</p>
                  <p>신청 유형:${element.workshop_category}</p>
                  <p>장소:${element.workshopDetail_wish_location}</p>
                  <p>인원:${element.workshopDetail_member_cnt}</p>
                  <p>기타 문의 사항:${element.workshopDetail_etc}</p>
                  <p>강사 연락처:${element.teacher_email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
        $('#incomplete-list').append(tempHtml);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

// 수강 완료 워크샵 불러오기 (추가 예정)

// 워크샵 결제하기
function open_iamport(workshop_id) {
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

        $.ajax({
          type: 'POST',
          url: `/api/mypage/workshop/order`,
          data: {
            workshopInstanceId,
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
          },
          success: function (response) {
            alert(response.message);
            window.location.reload();
          },
          error: function (error) {
            console.log('2222');
          },
        });
      } else {
        console.log('결제 실패');
        console.log(rsp);
      }
    },
  );
}
