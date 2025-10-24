import './cartItemCard.css';
import { Card, Button, Typography  } from 'antd';   
import { useDebouncedCartSync } from '../../hooks/useDebouncedCartSync';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';


const { Text } = Typography;

export const CartItemCard = React.memo(({ item, isOutOfStock }) => {  
    const navigate = useNavigate();
    const { handleQuantity, handleRemove } = useDebouncedCartSync();
    const [disabled, setDisabled] = useState('');

    const handleInput = (e) => {
        const val = Number(e.target.value);
        if (isNaN(val) || val > item.quantity) return;
        handleQuantity(item.product._id, val);
    }
    
    const handleButtonClick = (value) => {
        const updateQty = item.quantity + value;

        if (updateQty <= 1) setDisabled('minus');
        else if (updateQty >= item.product.stock) setDisabled('plus');
        else setDisabled('');

        handleQuantity(item.product._id, updateQty); 
    }


    const handleCardClick = () => {
        navigate(`/products/${item.product._id}`);
    }; 
 
    return (
        <Card size='small' className='cart-card'>
            <div className='cart-card-container'>
                <img 
                    src={item.product.imageURL} 
                    alt={item.product.name} 
                    className='cart-card-img' 
                    onClick={handleCardClick}
                />
                <div className='cart-card-content'>
                    <div className='cart-card-top'>
                        <div id='cart-card-product-name' onClick={handleCardClick}>
                            <h3>{ item.product.name }</h3>
                        </div>
                        <h3 className='price'>${item.product.price}</h3>
                    </div>

                    <div className='cart-card-bottom' onClick={(e) => e.stopPropagation()}>
                        <div className='cart-card-button-group'>
                            <Button size='small' 
                                disabled={ disabled === 'minus'}
                                onClick={() => { 
                                    handleButtonClick(-1);
                                }}>-</Button>
                            <input 
                                size='small'
                                type='text'
                                value={item.quantity} 
                                onChange={handleInput}
                            />
                            <Button size='small' 
                                disabled={ disabled === 'plus'}
                                onClick={() => { 
                                    handleButtonClick(1);
                                }}>+</Button>
                        </div>
                        <Button
                            style={{border: 'none', textDecoration: 'underline'}}
                            size='small' onClick={() => handleRemove(item.product._id,)}>Remove</Button>
                    </div>
                    
                    {isOutOfStock && (
                        <div className='cart-card-footer'>
                            <Text type="danger">This item is out of stock</Text>
                        </div>
                    )}
                </div>
            </div>
            
        </Card>
    );
});