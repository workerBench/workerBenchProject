// 블랙리스트 목록 불러오기

axios.get('../api/admin/ban/users')
  .then(function(response) {
    const users = response.data;
    let html = '';
    for (let user of users) {
      html += `
        <tr>
        <td>${user.email}</td>
        <td>${user.updatedAt.split('T')[0]}</td>
        <td>무성의한 응대</td>
        <td>
            <button class="admin-remove-btn" onclick="unbanUser('${user.id}')">UnBlack</button>
        </td>
        </tr>
      `;
    }
    $("#user-list-wrap").append(html);
  })
  .catch(function(error) {
    console.log(error);
  });

  axios.get('../api/admin/ban/companies')
  .then(function(response) {
    const companys = response.data;
    let html = '';
    for (let company of companys) {
      html += `
        <tr>
        <td>${company.company_name}</td>
        <td>${company.updatedAt.split('T')[0]}</td>
        <td>정산금 지속 연체</td>
        <td>
            <button class="admin-remove-btn" onclick="unbanCompany('${company.id}')">UnBlack</button>
        </td>
        </tr>
      `;
    }
    $("#company-list-wrap").append(html);
  })
  .catch(function(error) {
    console.log(error);
  });

  // 밴 해제

  async function unbanUser(id) {
    try {
      const response = await axios.patch(`/api/admin/unban/user/${id}`);
      alert("해당 유저가 블랙 해제되었습니다.")
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
  
  // 업체 밴 처리 함수
  async function unbanCompany(id) {
    try {
      const response = await axios.patch(`/api/admin/unban/company/${id}`);
      alert("해당 업체가 블랙 해제되었습니다.")
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }