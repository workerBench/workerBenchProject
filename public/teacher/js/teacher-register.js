document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('registerBtn');
  registerBtn.addEventListener('click', () => {
    const phone_number = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const name = document.getElementById('name').value;
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
        console.log(response);
        const data = response.data;
        alert(data.message);
        window.location.href = '/teacher/workshop';
      })
      .catch((response) => {
        console.log(response);
        const { data } = response.response;
        alert(data.error);
      });
  });
});
