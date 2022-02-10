const logform = document.forms.logForm;

logform?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userEmail = event.target.email.value;
  console.log(userEmail);
  const password = event.target.password.value;
  const res = await fetch('/logForm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail, password }),
  });
  const data = await res.json();//
  console.log(data);
  if (data.authorised === false) { // Проверки всей херни
    alert('Вы не зарегистрированы');
    window.location = '/regForm';
  }
  if (data.authorised === true) {
    window.location = '/';
  }
});
