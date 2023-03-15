document.addEventListener('DOMContentLoaded', () => {
  const workshopRegisterBtn = document.getElementById('workshopRegisterBtn');

  // 썸네일 미리보기
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

  const imgSel = document.querySelectorAll('.sub-img-file');
  for (let i = 1; i <= imgSel.length; i++) {
    imgSel[i - 1].addEventListener('change', function (event) {
      let files = event.target.files;

      if (files.length >= 1) {
        insertImageDate(i, files[0]);
      }

      if (!files.length) {
        const imgShow = document.querySelector(`#sub-img-${i}`);
        imgShow.removeAttribute('src');
      }
    });
  }

  async function insertImageDate(imgNum, file) {
    const imgShow = document.querySelector(`#sub-img-${imgNum}`);

    const reader = new FileReader();

    reader.addEventListener('load', function (event) {
      imgShow.src = reader.result;
    });
    reader.readAsDataURL(file);
  }

  workshopRegisterBtn.addEventListener('click', () => {
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
    // 썸네일 이미지 파일
    const thumbImg = document.querySelector('#thumb-img-file').files[0];
    // 서브 이미지 태그 묶음 -> 파일 배열
    const subImgsTags = document.querySelectorAll('.sub-img-file');
    const jsonData = {
      title: title,
      category: category,
      desc: desc,
      min_member: min_member,
      max_member: max_member,
      total_time: total_time,
      price: price,
      location: location,
      genre_id: genre_id,
      purpose_tag_id: purposeTagIds,
    };
    const formData = new FormData();
    formData.append('images', thumbImg);
    formData.append('jsonData', JSON.stringify(jsonData));

    for (let i = 1; i <= subImgsTags.length; i++) {
      const imgFile = subImgsTags[i - 1].files;
      if (imgFile.length >= 1) {
        formData.append('images', imgFile[0]);
      }
    }
    // const purpose_tag_array = purpose_tag.split(',').map((id) => parseInt(id));
    axios({
      method: 'post',
      url: '/api/teacher/workshops',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data',
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
