import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            postalCode: '',
            street: ''
        },
        loading: false
    }

    clickedHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            customer: {
                street: 'Teststreet 111',
                zipCode: '11223344',
                country: 'Bhutan'
            },
            deliveryMethod: 'fastest'
        };

        axios.post('/orders.json', order)
            .then(response => { this.setState({ loading: false }); console.log('response frm firebase: ', response);})
            .catch(err => this.setState({ loading: false }));
        console.log(this.props);
        this.props.history.push('/');
    }

    render() {

        let form = (
            <form>
                <input className={classes.Input} type="text" placeholder="Your name" />
                <input className={classes.Input} type="email" placeholder="Your email" />
                <input className={classes.Input} type="text" placeholder="Your street" />
                <input className={classes.Input} type="text" placeholder="Your ZipCode" />
                <Button btnType="Success" clicked={this.clickedHandler}>ORDER</Button>
            </form>
        );

        if(this.state.loading)
            form = <Spinner />;
            
        return(
            <div className={classes.ContactData}>
                <h4>Enter your Data:</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;