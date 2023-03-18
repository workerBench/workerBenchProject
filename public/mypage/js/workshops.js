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
              data-bs-target="#exampleModal"
            >
              상세 내역 보기
            </p>
          </div>
          <!-- Modal -->
          <div
            class="modal fade"
            id="exampleModal"
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
