// access 토큰이 만료되었을 시 refresh 토큰으로 access 토큰 재발급을 요청
const requestAccessToken = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/auth/refreshtoken/admin',
    });
    return true;
  } catch (err) {
    return false;
  }
};

// 에러 발생 시 상태 코드에 따른 로직 실행
const getErrorCode = async (statusCode, errorMessage) => {
  if (statusCode === 400) {
    alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
    return false;
  }
  if (statusCode === 401) {
    const refreshRes = await requestAccessToken();
    if (!refreshRes) {
      alert('현재 로그인이 되어있지 않습니다. 로그인 후 이용 가능합니다.');
      location.href = '/admin/login';
      return;
    }
    return true;
  }
  alert(`에러 코드: ${statusCode} / message: ${errorMessage}`);
  return false;
};

async function approvalAfterOnLoad() {
  axios
    .get('../api/admin/workshops/approval')
    .then(function (response) {
      const workshops = response.data;
      let html = '';
      for (let workshop of workshops) {
        html += `
                <div class="card">
                  <img src="${
                    workshop.ThumbUrl
                  }" alt="Image" onclick="showModal('${workshop.id}')">
                  <div class="card-text" onclick="showModal('${workshop.id}')">
                    <div class="category">
                        ${
                          workshop.category === 'online'
                            ? '<div class="online">온라인</div>'
                            : ''
                        }
                        ${
                          workshop.category === 'offline'
                            ? '<div class="offline">오프라인</div>'
                            : ''
                        }
                    </div>
                    <div class="workshop-title">${workshop.title}</div>
                    <div class="workshop-price">${workshop.price}원~</div>
                    <div class="personnel-and-time">
                        <div class="workshop-personnel">${
                          workshop.min_member
                        }명~${workshop.max_member}명</div>
                        <div class="workshop-time">${
                          workshop.total_time
                        }분</div>
                    </div>
                    <div class="workshop-tag">
                        <span class="tag">${workshop.GenreTag.name}</span>
                    </div>
                    
                  </div>
                  <button id="update-btn" onclick="updateModal('${
                    workshop.id
                  }')">수정하기</button>
                </div>
                `;
      }

      $('#workshop-list').append(html);
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        approvalAfterOnLoad();
      }
    });
}

approvalAfterOnLoad();

// 상세 정보 모달창
function showModal(workshopId) {
  axios
    .get(`../api/admin/workshops/${workshopId}`)
    .then(function (response) {
      const workshop = response.data;
      const modal = document.getElementById('modal');
      modal.innerHTML = `
            <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">워크숍 상세내용</h5>
              <button type="button" class="btn-close" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src="${workshop.ThumbUrl}" alt="Image" class="modal-image">
              <div class="info">
                <div class="info-category">${
                  workshop.workshop_category === 'online'
                    ? '온라인'
                    : '오프라인'
                }</div>
                <div class="info-title">${workshop.workshop_title}</div>
                <div class="info-desc">${workshop.workshop_desc}</div>
                <div class="info-ul">인원 :
                  <span class="info-li">${workshop.workshop_min_member}명 ~ ${
        workshop.workshop_max_member
      }명</span>
                </div>
                <div class="info-ul">시간 :
                  <span class="info-li">${workshop.workshop_total_time}분</span>
                </div>
                <div class="info-ul">장르 :
                  <span class="info-li">${workshop.genre_name}</span>
                </div>
                <div class="info-ul">목적 :
                  <span class="info-li">${workshop.purpose_name}</span>
                </div>
                <div class="info-ul">장소 :
                  <span class="info-li">${workshop.workshop_location}</span>
                </div>
                <div class="info-ul">강사 이름 :
                  <span class="info-li">${workshop.teacher_name}</span>
                </div>
                <div class="info-ul">강사 이메일 :
                  <span class="info-li">${workshop.user_email}</span>
                </div>
                <div class="info-price">${
                  workshop.workshop_price
                }원<span>최저가</span></div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="finished" onclick="finished(${
                workshop.workshop_id
              })">삭제하기</button>
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
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        showModal();
      }
    });
}

// 수정하기 모달창
function updateModal(workshopId) {
  axios
    .get(`../api/admin/workshops/${workshopId}`)
    .then(function (response) {
      const workshop = response.data;
      const modal = document.getElementById('modal');
      modal.innerHTML = `
      <div class="modal-update-content">
        <div class="modal-header">
          <h5 class="modal-title">워크숍 상세내용</h5>
          <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="modal-update-body">
            <div id="thumb-img-wrap">
              <img src="${workshop.ThumbUrl}"class="modal-update-image">
              <input type="file" accept="image/*" , id="thumb-img-file" />
            </div>
              <div class="form-wrap">
                  <select class="select-category" id="category">
                    <option value="online">online</option>
                    <option value="offline">offline</option>
                  </select>
                  <div>
                    <input type="text" class="title" id="title" value="${workshop.workshop_title}">
                  </div>
                  <div>
                    <textarea class="desc" id="desc">${workshop.workshop_desc}</textarea>
                  </div>
                  <div class="info-ul" id="member">인원 :
                  <span><input type="number" class="min-members" id="min-member" value="${workshop.workshop_min_member}"> 
                  ~ <input type="number" class="max-members" id="max-member" value="${workshop.workshop_max_member}"></span>
                  </div>
                  <div class="info-ul">시간 :
                    <input type="number" class="info-time" id="time"value="${workshop.workshop_total_time}">분</input>
                  </div>
                  <div class="info-ul">장르 :
                    <select class="select-genre" id="genre">
                      <option value=disabled selected>선택</option>
                      <option value="1">문화예술</option>
                      <option value="2">식음</option>
                      <option value="3">심리진단</option>
                      <option value="4">운동</option>
                    </select>
                  </div>
                  <div class="info-ul">목적 :
                    <select class="select-perpose-1" id="purpose-1">
                        <option value=disabled selected>선택</option>
                        <option value="1">동기부여</option>
                        <option value="2">팀워크</option>
                        <option value="3">회식</option>
                        <option value="4">힐링</option>
                    </select> ,
                    <select class="select-perpose-2" id="purpose-2">
                        <option value=disabled selected>선택</option>
                        <option value="1">동기부여</option>
                        <option value="2">팀워크</option>
                        <option value="3">회식</option>
                        <option value="4">힐링</option>
                    </select>
                  </div>
                  <div class="info-ul">장소 :
                    <input type="text" class="info-location" id="location"value="${workshop.workshop_location}">
                  </div>
                  <div class="info-ul">강사 이름 :
                  <span class="info-li">${workshop.teacher_name}</span>
                </div>
                <div class="info-ul">강사 이메일 :
                  <span class="info-li">${workshop.user_email}</span>
                </div>
                  <div>
                  <input type="email" class="info-price" id="price" value="${workshop.workshop_price}"> 원
                  </div>
              </div>
            </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" id="update" onclick="update(${workshop.workshop_id})">수정하기</button>
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
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        updateModal();
      }
    });
}

// ---------------- 워크숍 삭제하기 버튼 ---------------- //

function finished(workshopId) {
  axios
    .patch(`../api/admin/workshop/${workshopId}`)
    .then(function (response) {
      alert('워크숍이 삭제되었습니다.');
      location.reload();
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        finished();
      }
    });
}

// ---------------- 워크숍 수정하기 버튼 ---------------- //

function update(workshopId) {
  const title = $('#title').val();
  const category = $('#category').val();
  const desc = $('#desc').val();
  const min_member = parseInt($('#min-member').val());
  const max_member = parseInt($('#max-member').val());
  const total_time = parseInt($('#time').val());
  const genre_id = parseInt($('#genre').val());
  const price = parseInt($('#price').val());
  const purpose_1 = parseInt($('#purpose-1').val());
  const purpose_2 = parseInt($('#purpose-2').val()) || null;
  const purpose_tag_id = [purpose_1, purpose_2];

  if (
    !title ||
    !desc ||
    !min_member ||
    !max_member ||
    !total_time ||
    !price ||
    !purpose_1
  ) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  axios
    .put(`../api/admin/workshop/${workshopId}`, {
      title,
      category,
      desc,
      min_member,
      max_member,
      total_time,
      genre_id,
      price,
      purpose_tag_id,
    })
    .then(function (response) {
      alert('워크숍이 수정되었습니다.');
      location.reload();
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        update();
      }
    });
}

// -------------------- 워크숍 검색기능 --------------------- //

$(document).ready(() => {
  $('.search-button').on('click', async () => {
    const searchField = $('.form-select').val() === '1' ? 'email' : 'title';
    const searchText = $('.search-box').val();
    try {
      const params = new URLSearchParams();
      params.append(searchField, searchText);
      const { data } = await axios.get(
        `/api/admin/search/workshops/approval?${params.toString()}`,
      );
      const workshopList = $('#workshop-list');
      workshopList.empty();
      data.forEach((workshop) => {
        const cardHtml = `
              <div class="card">
              <img src="${workshop.ThumbUrl}" alt="Image" onclick="showModal('${
          workshop.id
        }')">
              <div class="card-text" onclick="showModal('${workshop.id}')">
                <div class="category">
                    ${
                      workshop.category === 'online'
                        ? '<div class="online">온라인</div>'
                        : ''
                    }
                    ${
                      workshop.category === 'offline'
                        ? '<div class="offline">오프라인</div>'
                        : ''
                    }
                </div>
                <div class="workshop-title">${workshop.title}</div>
                <div class="workshop-price">${workshop.price}원~</div>
                <div class="personnel-and-time">
                    <div class="workshop-personnel">${workshop.min_member}명~${
          workshop.max_member
        }명</div>
                    <div class="workshop-time">${workshop.total_time}분</div>
                </div>
                <div class="workshop-tag">
                    <span class="tag">${workshop.GenreTag.name}</span>
                </div>
              </div>
              <button id="update-btn" onclick="updateModal('${
                workshop.id
              }')">수정하기</button>
            </div>
          `;
        workshopList.append(cardHtml);
      });
    } catch (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        document.querySelector('.search-button').click();
      }
    }
  });
});
