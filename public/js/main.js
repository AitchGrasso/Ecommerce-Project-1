const deleteBtn = document.querySelectorAll('.del')
const cartItem = document.querySelectorAll('span.not')
const cartComplete = document.querySelectorAll('span.completed')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteCart)
})

Array.from(cartItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(cartComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteCart(){
    const cartId = this.parentNode.dataset.id
    try{
        const response = await fetch('cart/deleteCart', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'cartIdFromJSFile': cartId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const cartId = this.parentNode.dataset.id
    try{
        const response = await fetch('cart/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'cartIdFromJSFile': cartId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const cartId = this.parentNode.dataset.id
    try{
        const response = await fetch('cart/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'cartIdFromJSFile': cartId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}