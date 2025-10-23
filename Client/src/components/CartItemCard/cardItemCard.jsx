import React from 'react'; 
import './cartItemCard.css';
import { Card, Button } from 'antd';   
import { useDebouncedCartSync } from '../../hooks/useDebouncedCartSync';
import { useNavigate } from 'react-router-dom';

export const CartItemCard = ({ item }) => {  
    const navigate = useNavigate();
    const { handleQuantity, handleRemove } = useDebouncedCartSync();
    
    const handleCardClick = () => {
        navigate(`/products/${item.product._id}`);
    };
    
    const stopPropagation = (e) => e.stopPropagation();
 
    return (
        <Card size='small' className='cart-card' onClick={handleCardClick}>
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
                            <Button size='small' onClick={(e) => {
                                stopPropagation(e);
                                handleQuantity(item.product._id, item.quantity - 1)
                                }}>-</Button>
                            <input 
                                size='small'
                                type='text'
                                value={item.quantity}
                                onClick={stopPropagation}
                                onFocus={stopPropagation} 
                                onChange={(e) => handleQuantity(item.product._id, Number(e.target.value))}
                            />
                            <Button size='small'onClick={(e) => {
                                stopPropagation(e); 
                                handleQuantity(item.product._id, item.quantity + 1)
                                }}>+</Button>
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