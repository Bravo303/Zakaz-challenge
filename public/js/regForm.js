const regForms2 = document.forms.regForm;

regForms2?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const inputEmail = document.getElementById('regEmail');
  const inputName = document.getElementById('regName');
  const inputPass = document.getElementById('regPass');
  const valueEmail = inputEmail.value;
  const valueName = inputName.value;
  const valuePass = inputPass.value;
  const res = await fetch('/regForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ valueEmail, valueName, valuePass }),
  // console.log(regForm, "проверка рег формы");
  });
  const data = await res.json();
  if (data.authorised === false) {
    console.log('Вы уже зарегистрированы');
    // alert('Вы уже зарегистрированы');
    window.location = '/logForm';
  } else window.location = '/';
  // console.log(typeof (res.status));
  // console.log(res, "проверяет ");
});
