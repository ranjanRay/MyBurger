import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json', orderData)
            .then( response => {
                console.log('response frm firebase: ', response.data);
                dispatch(purchaseBurgerSuccess(response.data.name, orderData)); 
            })
            .catch(err => dispatch(purchaseBurgerFail(err)));
    }
}

export const fetchOrderSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    }
}

export const fetchOrderFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: Error
    }
}

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START,

    }
}

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrderStart());
        axios.get('/orders.json')
            .then(res => {
                console.log(res.data);
                let fetchedOrders = [];
                for(let key in res.data)
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                dispatch(fetchOrderSuccess(fetchedOrders))
                // console.log('orders arr:', this.state.orders);
            })
            .catch(err => {
                console.log('error occurred..', err);
                dispatch(fetchOrderFail(err));
            })
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}