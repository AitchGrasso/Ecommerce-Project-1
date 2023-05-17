let navbar = document.querySelector('.navbar')

document.querySelector('#menu-bar').onclick = () =>{
    navbar.classList.toggle('active');
}

document.querySelector('#close').onclick = () =>{
    navbar.classList.remove('active');
}

function fetchProducts(){
    fetch('https://fakestoreapi.com/products/category/electronic?limit=3%27')
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

const addToCartBtns = document.querySelectorAll('.btn-add-to-cart');
const cartNumber = document.querySelector('.header-checkout');

console.log(cartNumber);

addToCartBtns.forEach(btn => {
	const productId = btn.dataset.productId;

	btn.addEventListener('click', () => {
		fetch(`api/add/${productId}`)
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
