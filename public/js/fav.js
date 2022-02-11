const deletFav = document.querySelectorAll('.deletFav');
const addFav = document.querySelectorAll('.addFav');
for (let k = 0; k < deletFav.length; k++) {
  deletFav[k].addEventListener('click', async (event) => {
    const deletId = event.target.id;
    const res = await fetch(`/${deletId}`, {
      method: 'DELETE',
    });

    if (!res.ok) return;

    event.target.closest('.js-favItem').remove();
  });
}
for (let j = 0; j < addFav.length; j++) {
  addFav[j].addEventListener('click', async (event) => {
    const addID = event.target.id.slice(1);
    const imgSrs = event.target;
    const linkPic = addFav[j].parentNode.previousSibling.parentNode.childNodes[1].childNodes[0].src.slice(34);

    const res = await fetch('/addBasket', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ linkPic }),
    });
    if (!res.ok) return;
  });
}

const sendBtn = document.querySelector('.btnCreateOrder');
sendBtn.addEventListener('click', async (e) => {
  const res = await fetch('/email');
});
