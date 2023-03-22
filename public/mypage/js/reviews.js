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
      const title = document.getElementById('title').value;


      if (document.querySelector('#thumb-img-file').files.length < 1) {
        alert('썸네일 사진을 등록해 주세요!');
        return;
      }
  
      // 동영상을 첨부하였을 경우, 영상의 용량을 검사
      const isVideo = document.querySelector('#video-file').files;
      if (isVideo.length >= 1) {
        if (isVideo[0].size > 350000000) {
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
        url: '/api/:workshop_id/review',
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
          alert(response);
        });
    });
  
    // 워크샵 내용 및 사진 등록 후 영상 존재유무 체크 후 있다면 추가 등록.
    const uploadVideo = async (workshop_id, title, messageForSuccess) => {
      // 비디오 파일
      const check = document.querySelector('#video-file').files;
      if (!check.length) {
        // 비디오를 업로드하지 않았을 경우 바로 성공 메세지를 띄워준다.
        alert(messageForSuccess);
        window.location.href = '/teacher/workshop';
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
        url: '/api/mypage/:workshop_id/review/video',
        data: formData,
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
        .then((response) => {
          loadingBack.style.display = 'none';
          loadingMessage.style.display = 'none';
          alert(messageForSuccess);
          window.location.href = '/mypage/workshops';
        })
        .catch((response) => {
          loadingBack.style.display = 'none';
          loadingMessage.style.display = 'none';
          alert('영상을 업로딩 하던 도중 오류가 발생하였습니다.');
          window.location.href = '/mypage/workshops';
        });
      return true;
    };
  });