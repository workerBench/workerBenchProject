document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn');
  registerBtn.addEventListener('click', () => {
    const phone_number = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const name = document.getElementById('name').value;

    // 입력값 유효성 검사
    const addressRegex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9\s+]*$/;
    const addressValidationResult = addressRegex.test(address);

    const nameRegex = /^[ㄱ-ㅎ가-힣a-zA-Z\s+]*$/;
    const nameValidationResult = nameRegex.test(name);

    if (!addressValidationResult || !nameValidationResult) {
      console.log('주소와 이름에 특수문자는 포함될 수 없습니다.');
      return;
    }

    axios({
      method: 'post',
      url: '/api/teacher',
      data: {
        phone_number,
        address,
        name,
      },
    })
      .then((response) => {
        const data = response.data;
        alert(data.message);
        window.location.href = '/teacher/workshop';
      })
      .catch((response) => {
        const { data } = response.response;
        alert(data.error);
      });
  });
});
