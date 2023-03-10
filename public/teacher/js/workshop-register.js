document.addEventListener('DOMContentLoaded', () => {
  const workshopRegisterBtn = document.getElementById('registerBtn');

  workshopRegisterBtn.addEventListener('click', () => {
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const min_member = document.getElementById('min_member').value;
    const max_member = document.getElementById('max_member').value;
    const genre_id = document.getElementById('genre').value;
    const total_time = document.getElementById('total-time').value;
    const price = document.getElementById('price').value;
    const desc = document.getElementById('contents').value;
    const location = document.getElementById('contents').location;
    const thumb = document.getElementById('formFileMultiple').location;
    axios({
      method: 'post',
      url: '/api/teacher/workshops',
      data: {
        thumb,
        category,
        title,
        min_member,
        max_member,
        genre_id,
        total_time,
        price,
        desc,
        location,
      },
    })
      .then((response) => {
        console.log(response);
        const data = response.data;
        alert(data.message);
        window.location.href = '/teacher/workshop';
      })
      .catch((response) => {
        console.log(response);
        const { data } = response.response;
        alert(data.errorMessage);
      });
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
