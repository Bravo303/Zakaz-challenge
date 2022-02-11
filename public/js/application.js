const btn1 = document.querySelectorAll('.btn1');
const bigDiv = document.querySelector('.bigImg');
const delete1 = document.getElementById('delete');
const reset = document.querySelector('.resetfBtn');
const white = document.createElement('img');
const favBtn = document.getElementById('fav');
const basketBtn = document.getElementById('js-basket');

const img = document.createElement('img');// создаём элемент img

for (let i = 0; i < btn1.length; i++) { // циклом перебираем все кнопки выбора цыета для носкоа
  btn1[i].addEventListener('click', (event) => {
    event.preventDefault();
    if (white) {
      white.remove();
    }
    let val = event.target.name;
    // console.log(val);
    console.log(val.slice('_'));
    img.setAttribute('src', `image/Socks/${val}.png`);// задаём атрибутты
    img.setAttribute('class', 'bigImg');
    delete1.remove();
    bigDiv.appendChild(img);
    const btn2 = document.querySelectorAll('.btn2');
    for (let h = 0; h < btn2.length; h++) {
      btn2[h].addEventListener('click', async (e) => {
        e.preventDefault();
        let val1 = e.target.name;
        console.log(val1);
        img.setAttribute('src', `image/Socks/${val}_${val1}.png`);
        val = '';
        val1 = '';
        console.log(img.src.slice(34));
        const link = img.src.slice(34);
        img.setAttribute('class', 'bigImg');
        bigDiv.appendChild(img);
        favBtn.addEventListener('click', async (ev) => {
          ev.preventDefault();
          const res = await fetch('/fav', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link }),
          // console.log(regForm, "проверка рег формы");
          });
        });
        basketBtn.addEventListener('click', async (ev) => {
          ev.preventDefault();
          const resp = await fetch('/addBasket', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link }),
          // console.log(regForm, "проверка рег формы");
          });
        });
      });
    }
  });
}

reset?.addEventListener('click', (e) => {
  e.preventDefault();
  img.remove();
  delete1.remove();
  white.setAttribute('src', 'image/Socks/white.png');// задаём атрибутты
  white.setAttribute('class', 'bigImg');
  white.setAttribute('id', 'reset');
  bigDiv.appendChild(white);
});
