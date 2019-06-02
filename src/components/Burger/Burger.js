import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {

    console.log('Inside Burger.js..ingredients:', props.ingredients);

    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])]
                .map((_, index) => {
                    return <BurgerIngredient key={igKey + index} type={igKey}/>
                })
        })
        .reduce((arr, el) => {
            return arr.concat(el);
        }, []);

        if(transformedIngredients.length === 0) 
            transformedIngredients.push(<p key={Date.now()}>Please start adding ingredients.</p>);


    return(
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    )
}

export default burger;