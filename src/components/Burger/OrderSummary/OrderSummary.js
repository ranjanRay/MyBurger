import React, {  Component } from 'react';
import Aux from '../../../hoc/Auxilliary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {

    render() {

        const ingredientsList = Object.keys(this.props.ingredients)
        .map(igKey => 
            <li key={igKey}>
                <span style={{textTransform: 'capitalize'}}>
                    {igKey}
                </span>: 
                {this.props.ingredients[igKey]}
            </li>);

        return(
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with following ingredients:</p>
                <ul>
                    {ingredientsList}
                </ul>
                <p><strong>Total Price: {this.props.price.toFixed(2)}</strong></p>
                <p>Continue to checkout?</p>
                <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Aux>
        );
    }
};

export default OrderSummary;