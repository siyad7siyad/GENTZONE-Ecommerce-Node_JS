
const calculateSubtotal = (cart) => {
    let subtotal = 0;

    for (const cartItems of cart) {

        const priceToUse = cartItems.product.salePrice !== 0 ? cartItems.product.salePrice : cartItems.product.discount_Price

        subtotal += priceToUse * cartItems.quantity

    }

    return subtotal
}

const calculateProductTotal = (cart) => {
    let productTotal = []

    for (const cartItems of cart) {
        const priceToUse = cartItems.product.salePrice !== 0 ? cartItems.product.salePrice : cartItems.product.discount_Price
       
        const total = priceToUse* cartItems.quantity;

        productTotal.push(total)

    } 

    return productTotal
}

module.exports = {
    calculateSubtotal,
    calculateProductTotal
}

