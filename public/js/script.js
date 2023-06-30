let navbar = document.querySelector('.navbar')
const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
const cartNumber = document.querySelector('.header-checkout');

console.log('before I work')

addToCartBtns.forEach(btn => {
	const productId = btn.dataset.productId;

    console.log('I work!')

	btn.addEventListener('click', () => {
		fetch(`checkout/api/add/${productId}`)
			.then(res => res.json())
			.then(res => {
				if (res.status === 404) {
					console.error(res.message);
				} else {
					console.log(res);
					cartNumber.dataset.numItems++;

					// do a little animation to show something was added to the cart.
					cartNumber.classList.add('pulse-number');
					setTimeout(() => {
						cartNumber.classList.remove('pulse-number');
					}, 500);
				}
			})
	});
})

console.log('after I work')

document.querySelector('#menu-bar').onclick = () =>{
    navbar.classList.toggle('active');
}

document.querySelector('#close').onclick = () =>{
    navbar.classList.remove('active');
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