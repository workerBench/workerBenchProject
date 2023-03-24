document.addEventListener('DOMContentLoaded', () => {
  const workshopcompleteList = document.getElementById('teacher-completeBox');
  axios({
    method: 'get',
    url: '/api/teacher/workshops/complete',
    data: {},
  })
    .then((response) => {
      const data = response.data.complete_instance_list;
      for (let i = 0; i < data.length; i++) {
        const workshop_thumb = data[i].workshopThumbUrl;
        const workshop_title = data[i].workshop_title;
        const min_member = data[i].workshop_min_member;
        const max_member = data[i].workshop_max_member;
        const genreTag_name = data[i].genreTag_name;
        const purposeTag_name = data[i].purposeTag_name;
        const total_time = data[i].workshop_total_time;
        let hours = Math.floor(total_time / 60); // 60으로 나눈 몫을 구합니다
        let remainingMinutes = total_time % 60; // 60으로 나눈 나머지를 구합니다
        const price = data[i].workshop_price;
        const etc = data[i].workShopInstanceDetail_etc;
        const company = data[i].workShopInstanceDetail_company;
        const phone_number = data[i].workShopInstanceDetail_phone_number;
        const member_cnt = data[i].workShopInstanceDetail_member_cnt;
        const email = data[i].workShopInstanceDetail_email;
        const createdAt = data[i].workShopInstanceDetail_createdAt;
        const forFormat = new Date(createdAt);
        const createdDate = `${forFormat.getFullYear()}-${
          forFormat.getMonth() + 1
        }-${forFormat.getDate()} ${forFormat.getHours()}시 ${forFormat.getMinutes()}분`;
        let tempHtml = ``;
        tempHtml = `
        <div class="teacher-manage-div" >
        <div class="workshop-information-Div">
            <div class="teacher-workshop-li-div">
                <img src="${workshop_thumb}" alt="" />
                <li class="workshop-information-li-title">제목</li>
                <li class="workshop-information-li">최소인원</li>
                <li class="workshop-information-li">최대인원</li>
                <li class="workshop-information-li-tag">장르태그</li>
                <li class="workshop-information-li">총시간</li>
                <li class="workshop-information-li">가격</li>
            </div>
            <div class="workshop-information-div">
                <li class="workshop-information-title-data">${workshop_title}</li>
                <li class="workshop-information-data">${min_member}</li>
                <li class="workshop-information-data">${max_member}명</li>
                <li class="workshop-information-tag-data">${genreTag_name}<br>${purposeTag_name}</li>
                <li class="workshop-information-data">${hours}시간 ${remainingMinutes}분</li>
                <li class="workshop-information-data">${price}원</li>
            </div>
        </div>
        <div class="workshop-information-Div2">
            <div class="teacher-workshop-apply-div">
                <li class="workshop-information-apply">설명</li>
                <li class="workshop-information-apply">업체명</li>
                <li class="workshop-information-apply">휴대폰 번호</li>
                <li class="workshop-information-apply">인원수</li>
                <li class="workshop-information-apply">이메일</li>
                <li class="workshop-information-apply">생성날짜</li>
            </div>
            <div class="workshop-information-apply-div">
                <li class="workshop-information-apply-data">${etc}</li>
                <li class="workshop-information-apply-data">${company}</li>
                <li class="workshop-information-apply-data">${phone_number}</li>
                <li class="workshop-information-apply-data">${member_cnt}명</li>
                <li class="workshop-information-apply-data">${email}</li>
                <li class="workshop-information-apply-data">${createdDate}</li>
            </div>
        </div
    </div>
            `;
        workshopcompleteList.insertAdjacentHTML('beforeend', tempHtml);
      }
    })
    .catch((response) => {
      const { data } = response.response;
      alert(data.error);
    });
});
function workshop() {
  window.location.href = '/teacher/workshop';
}
function information() {
  window.location.href = '/teacher/workshop/information';
}
function register() {
  window.location.href = '/teacher/workshop/register';
}
function manage() {
  window.location.href = '/teacher/manage/complete';
}
function complete() {
  window.location.href = '/teacher/manage/complete';
}
function incomplete() {
  window.location.href = '/teacher/manage/incomplete';
}
