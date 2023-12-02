
const calculateSubtotal = (cart)=>{
    let subtotal = 0;

    for(const cartItems of cart){
        

        subtotal += cartItems.product.discount_Price*cartItems.quantity 

    }
console.log(subtotal,"lllll");
    return subtotal
}

const calculateProductTotal = (cart)=>{
    let productTotal = []

    for(const cartItems of cart){

      const total = cartItems.product.discount_Price*cartItems.quantity;

        productTotal.push(total)

    }

    return productTotal
}

module.exports ={
    calculateSubtotal,
    calculateProductTotal
}

