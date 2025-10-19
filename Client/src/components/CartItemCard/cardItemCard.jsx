import React from 'react'; 
import './cartItemCard.css';
import { Card, Button } from 'antd';   
import { useDebouncedCartSync } from '../../hooks/useDebouncedCartSync';

export const CartItemCard = ({ item }) => {  
    const { handleQuantity, handleRemove } = useDebouncedCartSync();
 
    return (
        <Card size='small' className='cart-card'>
            <div className='cart-card-container'>
                <img src={item.product.imageURL} alt={item.product.name} className='cart-card-img'/>

                <div className='cart-card-content'>
                    <div className='cart-card-top'>
                        <div id='cart-card-product-name'>
                            <h3>{ item.product.name }</h3>
                        </div>
                        <h3 className='price'>${item.product.price}</h3>
                    </div>

                    <div className='cart-card-bottom'>
                        <div className='cart-card-button-group'>
                            <Button size='small' onClick={() => handleQuantity(item.product._id, item.quantity - 1)}>-</Button>
                            <input 
                                size='small'
                                type='text'
                                value={item.quantity}
                                onChange={(e) => handleQuantity(item.product._id, Number(e.target.value))}
                            />
                            <Button size='small' onClick={() => handleQuantity(item.product._id, item.quantity + 1)}>+</Button>
                        </div>
                        <Button
                            style={{border: 'none', textDecoration: 'underline'}}
                            size='small' onClick={() => handleRemove(item.product._id,)}>Remove</Button>
                    </div>
                </div>
            </div>
            
        </Card>
    );
};