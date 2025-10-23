import './cartItemCard.css';
import { Card, Button, Typography  } from 'antd';   
import { useDebouncedCartSync } from '../../hooks/useDebouncedCartSync';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const CartItemCard = ({ item, isOutOfStock }) => {  
    const navigate = useNavigate();
    const { handleQuantity, handleRemove } = useDebouncedCartSync();
    
    const handleCardClick = () => {
        navigate(`/products/${item.product._id}`);
    }; 
 
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

                    <div className='cart-card-bottom' onClick={(e) => e.stopPropagation()}>
                        <div className='cart-card-button-group'>
                            <Button size='small' 
                                disabled={isOutOfStock}
                                onClick={() => { 
                                    handleQuantity(item.product._id, item.quantity - 1)
                                }}>-</Button>
                            <input 
                                disabled={isOutOfStock}
                                size='small'
                                type='text'
                                value={item.quantity} 
                                onChange={(e) => handleQuantity(item.product._id, Number(e.target.value))}
                            />
                            <Button size='small' 
                                disabled={isOutOfStock}
                                onClick={() => { 
                                    handleQuantity(item.product._id, item.quantity + 1)
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
};