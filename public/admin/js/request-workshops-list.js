$(document).ready(function() {
    $.ajax({
        url: "../api/admin/workshops/request",
        method: "GET",
        data: {},
        success: function(workshops) {
            console.log(workshops)
            let html = '';
            for (let workshop of workshops) {
                html += `
                <div class="col">
                    <div class="card" data-workshop.id="${workshop.id}">
                        <img src="${workshop.thumb}" class="card-img-top" alt="...">
                        <div class="card-body">
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
        }
    });
});
    // 워크숍 승인하기, 반려하기 기능
    $("#workshop-list").on("click", "#approve-workshop-btn", function() {
        const workshopId = $(this).closest(".card").data('workshop.id');
        $.ajax({
            url: `../api/admin/workshop/approval/${workshopId}`,
            method: "PATCH",
            data: {},
            success: function(response) {
                alert("워크숍이 승인되었습니다.")
                $(`#workshop-${workshopId}`).remove();
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });
    });

    $("#workshop-list").on("click", "#reject-workshop-btn", function() {
        const workshopId = $(this).closest(".card").data('workshop.id');
        $.ajax({
            url: `../api/admin/workshop/rejected/${workshopId}`,
            method: "PATCH",
            data: {},
            success: function(response) {
                alert("워크숍이 반려되었습니다.")
                $(`#workshop-${workshopId}`).remove();
                location.reload();
            },
            error: function(jqXHR, textStatus, errorThrown) {
            }
        });
    });

