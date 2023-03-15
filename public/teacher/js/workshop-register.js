document.addEventListener('DOMContentLoaded', () => {
  const workshopRegisterBtn = document.getElementById('workshopRegisterBtn');
  workshopRegisterBtn.addEventListener('click', () => {
    const thumb = document.getElementById('img').value;
    const category = document.getElementById('category').value;
    const title = document.getElementById('title').value;
    const min_member = document.getElementById('minMember').value;
    const max_member = document.getElementById('maxMember').value;
    const genre_id = document.getElementById('genreId').value;
    const purpose_tag1 = document.getElementById('purposeTagId1').value;
    const purpose_tag2 = document.getElementById('purposeTagId2').value;
    const total_time = document.getElementById('totalTime').value;
    const price = document.getElementById('price').value;
    const desc = document.getElementById('desc').value;
    const location = document.getElementById('location').value;
    const test1 = parseInt(purpose_tag1);
    const test2 = parseInt(purpose_tag2);
    const purposeTagIds = [test1, test2];
    console.log(purposeTagIds);
    // const purpose_tag_array = purpose_tag.split(',').map((id) => parseInt(id));

    axios({
      method: 'post',
      url: '/api/teacher/workshops',
      data: {
        thumb,
        category,
        title,
        min_member: parseInt(min_member),
        max_member: parseInt(max_member),
        genre_id: parseInt(genre_id),
        purpose_tag_id: purposeTagIds,
        total_time: parseInt(total_time),
        price: parseInt(price),
        desc,
        location,
      },
    })
      .then((response) => {
        const data = response.data;
        alert(data.message);
        // window.location.href = '/teacher/workshop';
      })
      .catch((response) => {
        console.log(response);
        const { data } = response.response;
        alert(data.message);
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
