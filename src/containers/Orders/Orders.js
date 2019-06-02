import React ,{ Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withError from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

    state = {
        loading: true,
        orders: []
    }

    componentDidMount = () => {
        // axios.get('/orders.json')
        //     .then(res => {
        //         console.log(res.data);
        //         let fetchedOrders = [];
        //         for(let key in res.data)
        //             fetchedOrders.push({
        //                 ...res.data[key],
        //                 id: key
        //             });
        //         this.setState({ loading: false, orders: fetchedOrders });
        //         console.log('orders arr:', this.state.orders);
        //     })
        //     .catch(err => {
        //         this.setState({ loading: false });
        //         console.log('error occurred..', err);
        //     })
        this.props.onFetchOrders();
    }

    render() {
        let orders = <Spinner />;
        if(!this.state.loading) {
            orders =
                this.props.orders.map(order => {
                    return(<Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={+order.price}/>)
                })
        }
        
        return(
            <div>
                {orders}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: () => dispatch(actions.fetchOrders())
    }
}
export default connect(null, mapDispatchToProps) (withError(Orders, axios));