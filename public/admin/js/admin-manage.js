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

async function getAdminList() {
  axios
    .get('../api/admin/admin/list')
    .then(function (response) {
      let adminUsers = response.data;
      let html = '';
      for (let adminUser of adminUsers) {
        html += `
        <tr>
          <td>${adminUser.name}</td>
          <td id="admin-email-${adminUser.id}">${adminUser.email}</td>
          <td>${adminUser.createdAt.split('T')[0]}</td>
          <td>${adminUser.admin_type === 0 ? 'normal admin' : ''}</td>
          <td>
            <button class="admin-remove-btn" onclick="deleteAdmin(${
              adminUser.id
            })">계정 삭제</button>
          </td>
        </tr>
      `;
      }
      $('#admin-user-list').append(html);
    })
    .catch(async function (error) {
      const result = await getErrorCode(
        error.response.data.statusCode,
        error.response.data.message,
      );
      if (result) {
        getAdminList();
      }
    });
}

getAdminList();

// 관리자 계정 삭제
const deleteAdmin = async (id) => {
  const email = document.querySelector(`#admin-email-${id}`).innerHTML;
  const check = confirm(`${email} 관리자 계정을 삭제하시겠습니까?`);
  if (check === false) {
    return;
  }

  try {
    const res = axios({
      method: 'DELETE',
      url: '/api/auth/admin',
      data: { email },
    });
    alert(`${email} 관리자 계정이 삭제되었습니다.`);
    location.reload();
  } catch (error) {
    const result = await getErrorCode(
      error.response.data.statusCode,
      error.response.data.message,
    );
    if (result) {
      deleteAdmin(id);
    }
  }
};

// 계정 생성 버튼 (모달창 띄우기)
const btn = document.getElementById('create-admin');

btn.onclick = function () {
  modal.style.display = 'block';
};

// 취소하기 버튼 클릭시 닫힘
const closeBtn = document.getElementById('close-btn');

closeBtn.addEventListener('click', function () {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
});

const closeBtn2 = document.querySelector('.btn-close');

closeBtn2.addEventListener('click', function () {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
});

// 모달창 외부를 클릭하면 닫힘
const modal = document.getElementById('modal');

modal.addEventListener('click', (e) => {
  const evTarget = e.target;
  if (evTarget.classList.contains('modal')) {
    modal.style.display = 'none';
  }
});

// ------------------------ 모달창 내부의 실제 관리자 생성 버튼 ------------------------ //

$(document).ready(function () {
  $('#create').on('click', function () {
    const email = $('#email').val();
    const password = $('#password').val();
    const name = $('#name').val();
    const phone = $('#phone').val();
    axios
      .post('../api/auth/admin', {
        email: email,
        password: password,
        name: name,
        phone_number: phone,
      })
      .then((response) => {
        alert('관리자 계정이 생성되었습니다.');
        location.reload(); // 페이지 새로고침
      })
      .catch(async (error) => {
        const result = await getErrorCode(
          error.response.data.statusCode,
          error.response.data.message,
        );
        if (result) {
          document.querySelector('#create').click();
        }
      });
  });
});
