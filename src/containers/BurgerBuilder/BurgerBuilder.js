import React, { Component } from 'react';
import Aux from '../../hoc/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../../axios-orders';


// import * as actionTypes from '../../store/actions/actionTypes';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {}
    // }
    state = {
        //ingredients: null,
        // totalPrice: 4,
        purchaseable: false,
        purchasing: false
    }

    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum, el) => {
                return sum + el
            }, 0);

        return sum > 0;
    }

    purchaseHandler = () => {
        this.setState({  purchasing: true });
    }

    // addIngredientHandler = (type) => {
    //     const ingredientCount = this.state.ingredients[type];
    //     const ingredientObj = {
    //         ...this.state.ingredients
    //     };

    //     ingredientObj[type] = ingredientCount + 1;
    //     const priceAddition = INGREDIENT_PRICES[type]; 
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({ingredients: ingredientObj, totalPrice: newPrice});
    //     this.updatePurchaseState(ingredientObj);
    // }

    // removeIngredientHandler = (type) => {
    //     const ingredientCount = this.state.ingredients[type];
    //     const ingredientObj = {
    //         ...this.state.ingredients
    //     };
    //     if(ingredientCount === 0)
    //         return;
    //     ingredientObj[type] = ingredientCount - 1;
    //     const priceDeduction = INGREDIENT_PRICES[type]; 
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({ingredients: ingredientObj, totalPrice: newPrice});
    //     this.updatePurchaseState(ingredientObj);
    // }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('continue');
        // const order = {
        //     customer: {
        //         street: 'Teststreet 111',
        //         zipCode: '11223344',
        //         country: 'Bhutan'
        //     },
        //     deliveryMethod: 'fastest',
        //     totalPrice: this.state.totalPrice
        // };

        // axios.post('/orders.json', order)
        //     .then(res => console.log('response: ', res))
        //     .catch(err => console.log(err));

        console.log('Inside purchaseContinuedHandler',this.props);
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    componentDidMount () {
    //     // console.log('Inside the componentDidMount in the BurgerBuilder.js');
    //     // axios.get('https://react-burger-app-115c1.firebaseio.com/ingredients.json')
    //     //     .then(response => this.setState({ ingredients: response.data }))
    //     //     .catch(err => this.setState({ error: true }));

    //     console.log('Inside the burgerbuilder.js.... log statement after the then.. catch method.');
        this.props.onIngredientInit();
    }

    render() {

        const disabledInfo = {...this.props.ings};
        console.log('disabled info:', disabledInfo);
        for(let key in disabledInfo)
            disabledInfo[key] = disabledInfo[key] <= 0;

        let orderSummary = null;        
        let burger = this.props.error ? <p>Ingredients can't be loaded.</p>: <Spinner />;
        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                        <BuildControls 
                            ingredientAdded={this.props.onIngredientAdded }
                            ingredientRemoved={this.props.onIngredientRemoved}
                            totalPrice={this.props.totalPrice}
                            disabledInfo={disabledInfo}
                            purchaseable={this.updatePurchaseState(this.props.ings)}
                            ordered={this.purchaseHandler}
                        />
                </Aux>);

            orderSummary = (<OrderSummary 
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.totalPrice}
            />);

            if(this.state.loading) {
                console.log('this.state.loading');
                orderSummary = <Spinner />
            }
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingredientName) => dispatch(actions.addIngredient(ingredientName)),
        onIngredientRemoved: (ingredientName) => dispatch(actions.removeIngredient(ingredientName)),
        onIngredientInit: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(BurgerBuilder), axios));