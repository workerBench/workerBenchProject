axios.get('../api/admin/workshops')
  .then(function(response) {
        const workshops = response.data;
            let html = '';
            for (let workshop of workshops) {
                html += `
                <div class="col">
                    <div class="card">
                        <img src="${workshop.thumb}" class="card-img-top" alt="...">
                        <div class="card-body" data-workshop.id="${workshop.id}">
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
                                <span class="tag">${workshop.genre_id}</span>
                            </div>
                            <div class="approval-or-refuse">
                                <button type="button" class="btn btn-outline-primary" id="update-btn">수정하기</button>
                                <button type="button" class="btn btn-outline-dark" id="remove-btn">삭제하기</button>
                            </div>
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

// ---------------- 워크숍 삭제하기 버튼 ---------------- //


$("#workshop-list").on("click", "#remove-btn", function() {
    const workshopId = $(this).closest(".card-body").data('workshop.id');
    axios.delete(`../api/admin/workshop/${workshopId}`)
        .then(function(response) {
            alert("워크숍이 삭제되었습니다.")
            location.reload();
        })
        .catch(function(error) {
            console.log(error);
        });
});

// -------------------- 워크숍 검색기능 --------------------- //

$(document).ready(() => {
    $('.search-button').on('click', async () => {
      const searchField = $('.form-select').val() === '1' ? 'email' : 'title';
      const searchText = $('.search-box').val();
      try {
        const params = new URLSearchParams();
        params.append(searchField, searchText);
        const { data } = await axios.get(`/api/admin/search/workshops?${params.toString()}`);
        const workshopList = $('#workshop-list');
        workshopList.empty();
        data.forEach(workshop => {
          const cardHtml = `
            <div class="col">
              <div class="card">
                <img src="${workshop.thumb}" class="card-img-top" alt="...">
                <div class="card-body" data-workshop.id="${workshop.id}">
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
                  <div class="approval-or-refuse">
                    <button type="button" class="btn btn-outline-primary" id="update-btn">수정하기</button>
                    <button type="button" class="btn btn-outline-dark" id="remove-btn">삭제하기</button>
                  </div>
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

