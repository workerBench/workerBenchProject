window.addEventListener('DOMContentLoaded', function () {
  getWishList();
  updateWishListCancel();
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
  

  // 찜 목록 불러오기
function getWishList() {
  axios
    .get('/api/mypage/workshops/wishlist')
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



// 찜하기 해제
function updateWishListCancel() {
  let query = window.location.search;
  let param = new URLSearchParams(query);
  let workshopId = param.get('workshopId');
  axios
    .post(`/api/workshops/${workshopId}/wish`) // user_id 임시로 하드코딩
    .then((res) => {
      console.log(res);
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
        updateWishListCancel,
      );
    });
}



      // 찜 되어있는 워크샵 하트 칠해져있기
      if (wishCheck) {
        document.querySelector('.wish').textContent = '♥';
      } else {
        document.querySelector('.wish').textContent = '♡';
      }