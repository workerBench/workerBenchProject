axios.get('../api/admin/workshops/approval')
  .then(function(response) {
        const workshops = response.data;
            let html = '';
            for (let workshop of workshops) {
                html += `
                <div class="card" onclick="showModal('${workshop.id}')">
                  <img src="${workshop.ThumbUrl}" alt="Image">
                  <div class="card-text">
                    <div class="category">
                        ${workshop.category === 'online' ? '<div class="online">온라인</div>' : ''}
                        ${workshop.category === 'offline' ? '<div class="offline">오프라인</div>' : ''}
                    </div>
                    <div class="workshop-title">${workshop.title}</div>
                    <div class="workshop-price">${workshop.price}원~</div>
                    <div class="personnel-and-time">
                        <div class="workshop-personnel">${workshop.min_member}명~${workshop.max_member}명</div>
                        <div class="workshop-time">${workshop.total_time}분</div>
                    </div>
                    <div class="workshop-tag">
                        <span class="tag">${workshop.GenreTag.name}</span>
                    </div>
                  </div>
                </div>
                `;
            }
            
            $("#workshop-list").append(html);
        })
    .catch(function(error) {
        console.log(error);
});

function showModal(workshopId) {
  axios.get(`../api/admin/workshops/${workshopId}`)
    .then(function(response) {
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
                <div class="info-category">${workshop.workshop_category === 'online' ? '온라인' : '오프라인'}</div>
                <div class="info-title">${workshop.workshop_title}</div>
                <div class="info-desc">${workshop.workshop_desc}</div>
                <div class="info-ul">인원 :
                  <span class="info-li">${workshop.workshop_min_member}명 ~ ${workshop.workshop_max_member}명</span>
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
                <div class="info-ul">강사 이름 :
                  <span class="info-li">${workshop.teacher_name}</span>
                </div>
                <div class="info-ul">강사 이메일 :
                  <span class="info-li">${workshop.user_email}</span>
                </div>
                <div class="info-price">${workshop.workshop_price}원<span>최저가</span></div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="finished" onclick="finished(${workshop.workshop_id})">삭제하기</button>
            </div>
          </div>
      `;
    
      modal.classList.add('show');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('style', 'display: block');

      const closeButton = modal.querySelector('.btn-close');
      closeButton.addEventListener('click', function() {
        modal.classList.remove('show');
        modal.removeAttribute('aria-modal');
        modal.removeAttribute('style');
      });

      modal.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.removeAttribute('aria-modal');
          modal.removeAttribute('style');
        }
      });
    })
    .catch(function(error) {
      console.log(error);
    });
}

// ---------------- 워크숍 삭제하기 버튼 ---------------- //


function finished(workshopId) {
  axios.delete(`../api/admin/workshop/${workshopId}`)
    .then(function(response) {
      alert("워크숍이 삭제되었습니다.")
      location.reload();
    })
    .catch(function(error) {
      console.log(error);
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
        const { data } = await axios.get(`/api/admin/search/workshops/approval?${params.toString()}`);
        const workshopList = $('#workshop-list');
        workshopList.empty();
        data.forEach(workshop => {
          const cardHtml = `
              <div class="card" onclick="showModal('${workshop.id}')">
              <img src="${workshop.ThumbUrl}" alt="Image">
              <div class="card-text">
                <div class="category">
                    ${workshop.category === 'online' ? '<div class="online">온라인</div>' : ''}
                    ${workshop.category === 'offline' ? '<div class="offline">오프라인</div>' : ''}
                </div>
                <div class="workshop-title">${workshop.title}</div>
                <div class="workshop-price">${workshop.price}원~</div>
                <div class="personnel-and-time">
                    <div class="workshop-personnel">${workshop.min_member}명~${workshop.max_member}명</div>
                    <div class="workshop-time">${workshop.total_time}분</div>
                </div>
                <div class="workshop-tag">
                    <span class="tag">${workshop.GenreTag.name}</span>
                </div>
              </div>
            </div>
          `;
          workshopList.append(cardHtml);
        });
      } catch (error) {
        console.error(error);
      }
    });
  });

