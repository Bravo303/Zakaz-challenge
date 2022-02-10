// const btn = document.getElementById('btn');
// const btn2 = document.getElementById('btn2');
// const div = document.querySelector('#div');
// let count = 0;
// let countPic = 0;
// btn.addEventListener('click', (event) => {
//   event.preventDefault();
//   const img = document.createElement('img');

//   if (count === 1) {
//     img.remove();
//   } else {
//     const val = event.target.name;

//     img.setAttribute('src', `image/${val}`);
//     img.setAttribute('class', 'img1');

//     div.appendChild(img);
//     // setTimeout(() => {
//     //   img.remove();
//     // }, 1000);

//     count++;
//   }
// });

// btn2.addEventListener('click', (el) => {
//   const childDiv = document.createElement('div');
//   childDiv.setAttribute('class', 'img2');
//   div.appendChild(childDiv);
//   el.preventDefault();
//   const img2 = document.createElement('img');

//   if (countPic === 1) {
//     console.log(count);
//     img2.remove();
//   } else {
//     const val = el.target.name;
//     console.log(el.target.name);

//     img2.setAttribute('src', `image/${val}`);
//     img2.setAttribute('class', 'img1');
//     console.log(img2);

//     childDiv.appendChild(img2);
//     // setTimeout(() => {
//     //   img.remove();
//     // }, 1000);

//     countPic++;
//     console.log(countPic);
//   }
// });

