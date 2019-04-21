import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        // ingredients: {
        //     Salad: 1,
        //     Bacon: 1,
        //     meat: 1
        // }
        ingredients: {},
        totalPrice: 0
    }


    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        console.log('Inside the checkoutCOntinuedHandler.');
        this.props.history.replace('/checkout/contact-data');
    }

    componentDidMount = () => {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let totalPrice = 0;
        for (let param of query.entries()) {
            console.log('[CHECKOUT.js]',param[0],', ',param[1]);
            if(param[0] === 'totalPrice')
                totalPrice = +param[1];
            else
                ingredients[param[0]] = +param[1];
        }
        this.setState({ ingredients: ingredients, totalPrice: totalPrice });
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutContinued={this.checkoutContinuedHandler}
                    checkoutCancelled={this.checkoutCancelledHandler}/>
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    render={(props) => 
                        <ContactData 
                            ingredients={this.state.ingredients} 
                            totalPrice={this.state.totalPrice}
                            {...props}
                        />}
                />
            </div>
        );
    }
}
export default Checkout;