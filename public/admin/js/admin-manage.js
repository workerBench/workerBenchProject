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