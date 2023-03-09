$(document).ready(function() {
  $.ajax({
      url: "../api/admin/admin/list",
      method: "GET",
      data: {},
      success: function(adminUsers) {
          console.log(adminUsers)
          let html = '';
          for (let adminUser of adminUsers) {
              html += `
              <tr>
                    <td>${adminUser.id}</td>
                    <td>${adminUser.name}</td>
                    <td>${adminUser.email}</td>
                    <td>${adminUser.createdAt}</td>
                    <td>${adminUser.admin_type === 0 ? 'normal admin' : ''}</td>
                    <td>
                        <button class="admin-remove-btn">계정 삭제</button>
                    </td>
                </tr>
              `;
          }
          
          $("#admin-user-list").append(html);
      }
  });
});

var modal = document.getElementById("modal");

var btn = document.getElementById("create-admin");

// 계정 생성 버튼
var create_button = document.getElementById("create");

var close_btn = document.getElementById("close_btn");

btn.onclick = function() {
  modal.style.display = "block";
}

create_button = function() {
    modal.style.display = "none";
}

modal.addEventListener("click", e => {
  const evTarget = e.target
  if(evTarget.classList.contains("modal")) {
      modal.style.display = "none"
  }
});