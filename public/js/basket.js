const deleteFromBasket = document.querySelectorAll('.deletFromBasket1');

for (let l = 0; l < deleteFromBasket.length; l++) {
  deleteFromBasket[l].addEventListener('click', async (event) => {
    event.preventDefault();
    console.log(event.target.id);
    const delId = event.target.id;
    console.log(delId);
    const res = await fetch(`/baskets/${delId.slice(1)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const d = await res.json();
    console.log(d);
    if (d.delete === true) {
      event.target.closest('.js-basItem').remove();
      const countEl = document.querySelector('.js-total');
      // countEl.innerText = 'Итого 0 пар';
      const r = await fetch('baskets/count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ 1: 1 }),
      });
      const dat = await r.json();
      console.log(dat);
      const countElement = document.querySelector('.js-total');
      countElement.innerText = `Итого :${dat.reduceNew} пар`;
    }
    if (d.delete === false) {
      console.log(d.count);
      const tr = document.getElementById(`4${d.id}`);
      tr.innerText = `${d.count}`;
      const countEl = document.querySelector('.js-total');
      console.log(d.reduce);
      countEl.innerText = `Итого :${d.reduce} пар`;
    }
  });
}
