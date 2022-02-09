const regForm = document.getElementById('regForm');
regForm?.addEventListener('submit', async (event) => {
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
  // const data = await res.json(); // Прилетает ответ с сервера и распаршеваем в ДЖСОН ска
  // console.log(typeof (res.status));
  // console.log(res, "проверяет ");
  if (res.status === 200) {
    alert('все ок');
  } else {
    alert('нет авторизации');
  }
  // console.log(data, 'проверка даты');
});
