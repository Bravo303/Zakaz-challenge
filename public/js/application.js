let design = '';
let color = '';
function viewSocks(des, col) {
  document.querySelector('#imageSocks').src = `image/Socks/${col}${des ? '_' + des : ''}.png`;
}

chooseColor?.addEventListener('click', (e) => {
  color = e.target.name;
  if (color) viewSocks(design, color);
});

chooseDesign?.addEventListener('click', (e) => {
  design = e.target.name;
  if (design) viewSocks(design, color);
});

clear?.addEventListener('click', (e) => {
  design = '';
  color = '';
  viewSocks(design, color);
});

basket?.addEventListener('click', async (e) => {
  const resp = await fetch('/addBasket', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ link: `${color}${design ? '_' + design : ''}.png` }),
    // console.log(regForm, "проверка рег формы");
  });
  if (!resp.ok) alert('что-то не удалось');
});

fav?.addEventListener('click', async (e) => {
  const resp = await fetch('/fav', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ link: `${color}${design ? '_' + design : ''}.png` }),
  });
  if (!resp.ok) alert('что-то не удалось');
});
