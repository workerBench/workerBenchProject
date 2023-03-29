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
      console.log('여기여기~');
      const imgShow = document.querySelector(`#thumb-img-show`);
      imgShow.removeAttribute('src');
    }
  });

  // 비디오 미리보기
  const videoFile = document.querySelector('#video-file');
  videoFile.addEventListener('change', (event) => {
    let files = event.target.files;
    if (files.length >= 1) {
      const videoShow = document.querySelector('#video-show-tag');
      const videourl = URL.createObjectURL(files[0]);
      videoShow.setAttribute('style', 'display:inline');
      videoShow.setAttribute('src', videourl);
      // videoShow.play();
    }
    if (!files.length) {
      const videoWrap = document.querySelector('#video-show-tag-wrap');
      videoWrap.innerHTML = `<video id="video-show-tag" controls></video>`;
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

  // 워크샵 등록하기
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
    const purpose_value1 = parseInt(purpose_tag1);
    const purpose_value2 = parseInt(purpose_tag2);

    const purposeTagIds = [purpose_value1, purpose_value2];
    if (
      category === '' ||
      !title ||
      !min_member ||
      !max_member ||
      genre_id === '' ||
      !total_time ||
      !price ||
      !desc ||
      location === ''
    ) {
      alert('빈 칸을 채워 주세요!');
      return;
    }
    if (document.querySelector('#thumb-img-file').files.length < 1) {
      alert('썸네일 사진을 등록해 주세요!');
      return;
    }

    if (!purpose_value1 && !purpose_value2) {
      alert('목적태그 최소 한개는 등록해주세요');
      return;
    }

    if (purpose_value1 === purpose_value2) {
      alert('중복된 목적을 선택하셨습니다.');
      return;
    }

    // 입력받은 숫자값들에 대한 정수 유효성 검사
    if (
      Number(min_member) <= 0 ||
      Number(max_member) <= 0 ||
      Number.isNaN(Number(min_member)) ||
      Number.isNaN(Number(max_member))
    ) {
      alert('인원수는 최소 1명 이상이어야 합니다.');
      return;
    }
    if (Number(min_member) >= Number(max_member)) {
      alert('최대 인원수는 최소 인원수보다 많아야 합니다.');
      return;
    }
    if (Number(total_time) <= 0 || Number.isNaN(Number(total_time))) {
      alert('워크샵 과정 소요 시간은 0분 이상이어야 합니다.');
      return;
    }
    if (Number(price) <= 0 || Number.isNaN(Number(price))) {
      console.log(Number(price));
      alert('1인당 가격은 0보다 커야 합니다.');
      return;
    }
    if (
      !Number.isInteger(Number(min_member)) ||
      !Number.isInteger(Number(max_member)) ||
      !Number.isInteger(Number(total_time)) ||
      !Number.isInteger(Number(price))
    ) {
      alert('숫자의 경우 정수만 입력 가능합니다.');
      return;
    }

    // 동영상을 첨부하였을 경우, 영상의 용량을 검사
    const isVideo = document.querySelector('#video-file').files;
    if (isVideo.length >= 1) {
      if (isVideo[0].size > 400000000) {
        alert('동영상의 용량이 제한을 초과합니다.');
        return;
      }
    }

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
    axios({
      method: 'post',
      url: '/api/teacher/workshops',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
      .then(async (response) => {
        const data = response.data;
        const workshop_id = data.workshop_id;
        const title = data.title;
        await uploadVideo(workshop_id, title, data.message);
      })
      .catch((response) => {
        const { data } = response.response;
        console.log(data);
        alert(data.error);
      });
  });

  // 워크샵 내용 및 사진 등록 후 영상 존재유무 체크 후 있다면 추가 등록.
  const uploadVideo = async (workshop_id, title, messageForSuccess) => {
    // 비디오 파일
    const check = document.querySelector('#video-file').files;
    if (!check.length) {
      // 비디오를 업로드하지 않았을 경우 바로 성공 메세지를 띄워준다.
      alert(messageForSuccess);
      // window.location.href = '/teacher/workshop';
      return;
    }
    // 영상 업로드 과정에서 시간이 소비될 가능성이 있기에, "진행 중" 이라는 알림을 띄운다.
    const loadingBack = document.querySelector('#uploading-video');
    const loadingMessage = document.querySelector('#waiting-upload');
    loadingBack.style.display = 'block';
    loadingMessage.style.display = 'block';

    const video = document.querySelector('#video-file').files[0];
    const jsonData = {
      workshop_id,
      title,
    };

    const formData = new FormData();
    formData.append('video', video);
    formData.append('jsonData', JSON.stringify(jsonData));

    axios({
      method: 'post',
      url: '/api/teacher/workshops/video',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
      .then((response) => {
        loadingBack.style.display = 'none';
        loadingMessage.style.display = 'none';
        alert(messageForSuccess);
        window.location.href = '/teacher/workshop';
      })
      .catch((response) => {
        loadingBack.style.display = 'none';
        loadingMessage.style.display = 'none';

        if (
          response.response.data.error &&
          response.response.data.error !== '' &&
          typeof response.response.data.error === 'string'
        ) {
          alert(response.response.data.error);
        } else {
          alert('워크샵 등록 과정에서 오류가 발생하였습니다.');
        }
        window.location.href = '/teacher/workshop';
      });
    return true;
  };
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
