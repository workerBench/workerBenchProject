document.addEventListener('DOMContentLoaded', () => {
  const registerBtn = document.getElementById('company-registerBtn');
  registerBtn.addEventListener('click', () => {
    const company_type = document.getElementById('companyType').value;
    const company_name = document.getElementById('companyName').value;
    const business_number = document.getElementById('businessNumber').value;
    const rrn_front = document.getElementById('residentFrontNumber').value;
    const rrn_back = document.getElementById('residentBackNumber').value;
    const bank_name = document.getElementById('bankName').value;
    const account = document.getElementById('accountNumber').value;
    const saving_name = document.getElementById('savingName').value;
    axios({
      method: 'post',
      url: '/api/teacher/company',
      data: {
        company_type: parseInt(company_type),
        company_name,
        business_number: parseInt(business_number),
        rrn_front: parseInt(rrn_front),
        rrn_back: parseInt(rrn_back),
        bank_name,
        account: parseInt(account),
        saving_name,
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
        alert(data.message);
      });
  });
});
