import React from 'react';
import classes from './Order.css';

const order = props => {

    const ingredients = [];

    for(let igName in props.ingredients) {
        ingredients.push({
            name: igName,
            amount: props.ingredients[igName]
        });
    }

    const transformedIngredients = ingredients.map(ig => 
        <span style={{
            textTransform: 'capitalize',
            display: 'inline-block',
            margin: '0 8px',
            border: '1px solid #ccc',
            padding: '5px'
        }}>
            {ig.name}({ig.amount})
        </span>);

    return(
        <div className={classes.Order}>
            <p>Ingredients: {transformedIngredients}</p>
            <p>Price: <strong>{props.price.toFixed(2)}</strong></p>
        </div>);
}

export default order;