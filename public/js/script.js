let navbar = document.querySelector('.navbar')

document.querySelector('#menu-bar').onclick = () =>{
    navbar.classList.toggle('active');
}

document.querySelector('#close').onclick = () =>{
    navbar.classList.remove('active');
}

function fetchProducts(){
    fetch('https://fakestoreapi.com/products/category/electronics?limit=3%27')
    .then((res) => res.json())
    .then((data) => {
        console.log(data)

        data.forEach((obj, index) => {

            const {
                title,
                price,
                description,
                image
            } = obj

            const titles = document.querySelectorAll('.content-title')
            titles[index].innerText = title

            console.log(titles)
        
            // const images = document.querySelectorAll('.big-image img')
            // images[index].src = price

            // const images = document.querySelectorAll('.big-image img')
            // images[index].src = description

            const images = document.querySelectorAll('.big-image img')
            images[index].src = image  //change class to something more specific

        })


    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

window.onload = () => {
    fetchProducts()
}

window.onscroll = () =>{

    navbar.classList.remove('active');

    if(window.scrollY > 100){
        document.querySelector('header').classList.add('active');
    }else{
        document.querySelector('header').classList.remove('active');
    }

}

let themeToggler = document.querySelector('#theme-toggler');

themeToggler.onclick = () =>{
    themeToggler.classList.toggle('fa-sun');
    if(themeToggler.classList.contains('fa-sun')){
        document.querySelector('body').classList.add('active');
    }else{
        document.querySelector('body').classList.remove('active');
    }
}

// document.querySelectorAll('.small-image-1').forEach(images =>{
//     images.onclick = () =>{
//         document.querySelector('.big-image-1').src = images.getAttribute('src');
//     }
// });

// document.querySelectorAll('.small-image-2').forEach(images =>{
//     images.onclick = () =>{
//         document.querySelector('.big-image-2').src = images.getAttribute('src');
//     }
// });

// document.querySelectorAll('.small-image-3').forEach(images =>{
//     images.onclick = () =>{
//         document.querySelector('.big-image-3').src = images.getAttribute('src');
//     }
// });

// let countDate = new Date('aug 1, 2021 00:00:00').getTime();

// function countDown(){

//     let now = new Date().getTime();
// 	gap = countDate - now;

//     let seconds = 1000;
//     let minutes = seconds * 60;
//     let hours = minutes * 60;
//     let days = hours * 24;

//     let d = Math.floor(gap / (days));
// 	let h = Math.floor((gap % (days)) / (hours));
// 	let m = Math.floor((gap % (hours)) / (minutes));
// 	let s = Math.floor((gap % (minutes)) / (seconds));

//     document.getElementById('days').innerText = d;
//     document.getElementById('hours').innerText = h;
//     document.getElementById('minutes').innerText = m;
//     document.getElementById('seconds').innerText = s;

// }

setInterval(function(){
    countDown()
},1000);

var swiper = new Swiper(".product-slider", {
    slidesPerView: 3,
    loop:true,
    spaceBetween: 10,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        550: {
          slidesPerView: 2,
        },
        800: {
          slidesPerView: 3,
        },
        1000: {
            slidesPerView: 3,
        },
    },
});

var swiper = new Swiper(".review-slider", {
    slidesPerView: 3,
    loop:true,
    spaceBetween: 10,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        550: {
          slidesPerView: 2,
        },
        800: {
          slidesPerView: 3,
        },
        1000: {
            slidesPerView: 3,
        },
    },
});