import React from 'react'; 
import './cartItemCard.css';
import { Card, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeItem } from '../../store/cart/cartSlice';

export const CartItemCard = ({ item }) => {
    const dispatch = useDispatch();

    const handleQuantity = (qty) => {
        if (qty < 0) {
            //message.warning('Quantity cannot be 0'); 
            return;
        }
        dispatch(updateQuantity({productId: item.product._id, quantity: qty})); 
    };

    const handleRemove = () => {
        dispatch(removeItem(item.product._id));
    }

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
                            <Button size='small' onClick={() => handleQuantity(item.quantity - 1)}>-</Button>
                            <input 
                                size='small'
                                type='text'
                                value={item.quantity}
                                onChange={(e) => handleQuantity(Number(e.target.value))}
                            />
                            <Button size='small' onClick={() => handleQuantity(item.quantity + 1)}>+</Button>
                        </div>
                        <Button
                            style={{border: 'none', textDecoration: 'underline'}}
                            size='small' onClick={handleRemove}>Remove</Button>
                    </div>
                </div>
            </div>
            
        </Card>
    );
};