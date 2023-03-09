$(document).ready(function() {
    $.ajax({
        url: "../api/admin/workshops",
        method: "GET",
        data: {},
        success: function(workshops) {
            console.log(workshops)
            let html = '';
            for (let workshop of workshops) {
                html += `
                <div class="col">
                    <div class="card">
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
                                <button type="button" class="btn btn-outline-primary">수정하기</button>
                                <button type="button" class="btn btn-outline-dark">삭제하기</button>
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

