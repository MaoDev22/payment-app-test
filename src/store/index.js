import { createStore } from 'redux';

const initialState = {
    token: null,
    products: []
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_AUTH_TOKEN':
        return { ...state, token: action.payload };
    case 'ADD_PRODUCT':
        return { ...state, products: [...state.products, action.payload] };
    case 'DELETE_PRODUCT':
        const productsFiltered = state.products.filter((item) => item.id !== action.payload);
        return { ...state, products: productsFiltered };
    case 'CLEAR_STORE_PRODUCTS':
        return { ...state, products: [] };
    case 'CLOSE_SESION':
        return { ...state, token: null };
    default:
        return state;
  }
}

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (e) {
        console.warn('No se pudo guardar el estado en localStorage', e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) return initialState;
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn('No se pudo cargar el estado desde localStorage', e);
        return initialState;
    }
}

const store = createStore(
    counterReducer,
    loadFromLocalStorage()
);

store.subscribe(() => saveToLocalStorage(store.getState()));


export const setAuthToken = (token) => ({
    type: 'SET_AUTH_TOKEN',
    payload: token,
});

export const addProduct = (product) => ({
    type: 'ADD_PRODUCT',
    payload: product,
});

export const deleteProduct = (id) => ({
    type: 'DELETE_PRODUCT',
    payload: id,
});

export const clearStoreProducts = (id) => ({
    type: 'CLEAR_STORE_PRODUCTS'
});

export const closeSesion = (id) => ({
    type: 'CLOSE_SESION'
});

export default store;
