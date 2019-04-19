import React, { Component } from 'react';
import Aux from '../../hoc/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    Salad: 0.5,
    Bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => {
                return sum + el
            }, 0);

        this.setState({ purchaseable: sum > 0});
    }

    purchaseHandler = () => {
        this.setState({  purchasing: true });
    }

    addIngredientHandler = (type) => {
        const ingredientCount = this.state.ingredients[type];
        const ingredientObj = {
            ...this.state.ingredients
        };

        ingredientObj[type] = ingredientCount + 1;
        const priceAddition = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ingredients: ingredientObj, totalPrice: newPrice});
        this.updatePurchaseState(ingredientObj);
    }

    removeIngredientHandler = (type) => {
        const ingredientCount = this.state.ingredients[type];
        const ingredientObj = {
            ...this.state.ingredients
        };
        if(ingredientCount === 0)
            return;
        ingredientObj[type] = ingredientCount - 1;
        const priceDeduction = INGREDIENT_PRICES[type]; 
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ingredients: ingredientObj, totalPrice: newPrice});
        this.updatePurchaseState(ingredientObj);
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('continue');
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                street: 'Teststreet 1',
                zipCode: '11223344',
                country: 'Bhutan'
            },
            deliveryMethod: 'fastest'
        };

        axios.post('/orders.json', order)
            .then(response => this.setState({ loading: false, purchasing: false }))
            .catch(err => this.setState({ loading: false, purchasing: false }));
        
    }

    componentDidMount () {
        console.log('Inside the componentDidMount in the BurgerBuilder.js');
        axios.get('https://react-burger-app-115c1.firebaseio.com/orders/-LcAs3DlUJ76YHFrnvds/ingredients.json')
            .then(response => this.setState({ ingredients: response.data }))
            .catch(err => this.setState({ error: true }));

        console.log('Inside the burgerbuilder.js.... log statement after the then.. catch method.');
    }

    render() {

        const disabledInfo = {...this.state.ingredients};
        for(let key in disabledInfo)
            disabledInfo[key] = disabledInfo[key] <= 0;

        let orderSummary = null;        
        let burger = this.state.error ? <p>Ingredients can't be loaded.</p>: <Spinner />;
        
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                        <BuildControls 
                            ingredientAdded={this.addIngredientHandler}
                            ingredientRemoved={this.removeIngredientHandler}
                            totalPrice={this.state.totalPrice}
                            disabledInfo={disabledInfo}
                            purchaseable={this.state.purchaseable}
                            ordered={this.purchaseHandler}
                        />
                </Aux>);

            orderSummary = (<OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
            />);

            if(this.state.loading)
                orderSummary = <Spinner />
        }

        return (
            <Aux>
                <Modal 
                    show={this.state.purchasing} 
                    modalClosed={this.purchaseCancelHandler}
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);