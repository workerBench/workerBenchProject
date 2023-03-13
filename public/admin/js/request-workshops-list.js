axios.get('../api/admin/workshops/request')
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
                <button type="button" class="btn btn-outline-primary" id="approve-workshop-btn">승인하기</button>
                <button type="button" class="btn btn-outline-dark" id="reject-workshop-btn">반려하기</button>
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


// ---------------- 워크숍 승인 / 반려하기 버튼 ---------------- //


$("#workshop-list").on("click", "#approve-workshop-btn", function() {
    const workshopId = $(this).closest(".card-body").data('workshop.id');
    axios.patch(`../api/admin/workshop/approval/${workshopId}`)
        .then(function(response) {
            alert("워크숍이 승인되었습니다.")
            location.reload();
        })
        .catch(function(error) {
            console.log(error);
        });
});

    $("#workshop-list").on("click", "#reject-workshop-btn", function() {
        const workshopId = $(this).closest(".card-body").data('workshop.id');
        axios.patch(`../api/admin/workshop/rejected/${workshopId}`)
            .then(function(response) {
                alert("워크숍이 반려되었습니다.")
                location.reload();
            })
            .catch(function(error) {
                console.log(error);
            });
    });

