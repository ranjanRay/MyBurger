import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {

    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your ZipCode'
                },
                value: '',
                validation: {
                    required: true,
                    length: {
                        minLength: 5,
                        maxLength: 5
                    }
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest'},
                        { value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                valid: true
            }
        },
        loading: false,
        isFormValid: false
    }

    checkValidity = (value, rules) => {
        let isValid = false;

        if(!rules)
            return isValid;

        if(rules.required)
            isValid = value.trim() !== '';
        
            if(rules.length)
                isValid = value.trim().length >= rules.length.minLength
                    && value.trim().length <= rules.length.maxLength
                    && isValid;

            return isValid;
    }

    clickedHandler = (event) => {
        event.preventDefault();
        let formData = {};
        for(let formElement in this.state.orderForm) {
            formData[formElement] = this.state.orderForm[formElement].value;
        }
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
            orderData: formData
        };

        axios.post('/orders.json', order)
            .then(response => { this.setState({ loading: false }); console.log('response frm firebase: ', response);})
            .catch(err => this.setState({ loading: false }));
        console.log(this.props);
        this.props.history.push('/');
    }

    inputChangedHandler = (event, inputIdentifier) => {
        console.log(event.target.value);
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        console.log(updatedOrderForm);
        let isFormValid = true;
        for(let iter in updatedOrderForm) {
            isFormValid = isFormValid && updatedOrderForm[iter].valid
        }

        console.log('isFOrmValid: ', isFormValid);
        this.setState({ orderForm: updatedOrderForm, isFormValid: isFormValid });
    }

    render = () => {

        let formArray = [];
        for(let key in this.state.orderForm) {
            formArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.clickedHandler}>
                {formArray.map(formElement => {
                    return <Input
                        key = {formElement.id} 
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}/>
                })}
                <Button btnType="Success" disabled={!this.state.isFormValid} clicked={this.clickedHandler}>ORDER</Button>
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