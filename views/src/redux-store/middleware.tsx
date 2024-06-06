export const localStorageMiddleWare = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (action.type.startsWith('cart/')) {
        const state = store.getState();
        if (!state.user.isAuthenticated) {
            const cartState = {
                cart: state.cart.cart,
                total_items: state.cart.total_items,
                total: state.cart.total
            };
            // Save the object to local storage in one line
            localStorage.setItem('cartState', JSON.stringify(cartState));
        }
    }
    return result;
}