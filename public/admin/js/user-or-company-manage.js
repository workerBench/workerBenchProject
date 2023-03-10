$(document).ready(() => {
    $('.search-button').on('click', async () => {
      const searchField = $('.form-select').val() === '1' ? 'email' : 'company';
      const searchText = $('.search-box').val();
      try {
        const params = new URLSearchParams();
        params.append(searchField, searchText);
        const { data } = await axios.get('/api/admin/search/members', { params: params });
  
        // 기존의 결과를 모두 지웁니다.
        $('.user-list-wrap').empty();
        $('.company-list-wrap').empty();
  
        // 검색 결과를 동적으로 추가합니다.
        if (searchField === 'email') {
          data.forEach(user => {
            const userHtml = `
              <div class="user-data">${user.email}</div>
              <div class="ban-btn" onclick="banUser('${user.id}')">Black</div>
            `;
            $('.user-list-wrap').append(userHtml);
          });
        } else {
          data.forEach(company => {
            const companyHtml = `
              <div class="company-data">${company.company_name}</div>
              <div class="ban-btn" onclick="banCompany('${company.id}')>Black</div>
            `;
            $('.company-list-wrap').append(companyHtml);
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  });

// 사용자 밴 처리 함수
async function banUser(id) {
    try {
      const response = await axios.patch(`/api/admin/ban/user/${id}`);
      alert("해당 유저가 블랙 처리되었습니다.")
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }
  
  // 업체 밴 처리 함수
  async function banCompany(id) {
    try {
      const response = await axios.patch(`/api/admin/ban/company/${id}`);
      alert("해당 업체가 블랙 처리되었습니다.")
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  