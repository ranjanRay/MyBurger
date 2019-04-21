import React ,{ Component } from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withError from '../../hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {

    state = {
        loading: true,
        orders: []
    }

    componentDidMount = () => {
        axios.get('/orders.json')
            .then(res => {
                console.log(res.data);
                let fetchedOrders = [];
                for(let key in res.data)
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                this.setState({ loading: false, orders: fetchedOrders });
                console.log('orders arr:', this.state.orders);
            })
            .catch(err => {
                this.setState({ loading: false });
                console.log('error occurred..', err);
            })
    }

    render() {
        
        return(
            <div>
                {this.state.orders.map(order => {
                    return(<Order 
                        key={order.id}
                        ingredients={order.ingredients}
                        price={+order.price}/>)
                })}
            </div>
        );
    }
}

export default withError(Orders, axios);