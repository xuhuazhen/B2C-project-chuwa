import { useState } from 'react';  
import './style.css';
import {
    Input,
    Drawer,
    Divider,
    Button,
    Typography,  
    Form,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CartItemCard } from '../../components/CartItemCard/cardItemCard';

import { useSelector, useDispatch } from "react-redux";
import { subTotalPrice, 
    totalCartItem, 
    totalPrice, 
    discountAmount, 
    totalTax } from '../../store/cart/cartSelectors';
import { validatePromoCodeThunk } from '../../store/cart/cartThunk';

const { Title } = Typography;


const CheckoutPage = ({open, onClose}) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const itemCount = useSelector(totalCartItem);
    const subtotal = useSelector(subTotalPrice);
    const tax = useSelector(totalTax);
    const discount = useSelector(discountAmount);
    const total = useSelector(totalPrice);
    
    const [form] = Form.useForm();
    const [validateStatus, setValidateStatus] = useState('');
    const [helpText, setHelpText] = useState(''); 
    
    const handleApplyCode = async() => {
        const codeInput = form.getFieldValue('promo')?.toUpperCase();
        if (!codeInput || !codeInput.trim()) {
            setValidateStatus('error');
            setHelpText('Please enter a valid code');
            dispatch({
                type: 'cart/validatePromoCode/rejected',
                payload: { code: null, discountRate: 0},
            });
            return;
        }

        try {
            await dispatch(validatePromoCodeThunk(codeInput)).unwrap(); 
        } catch(err) {
            console.log(err);
            setValidateStatus('error');
            setHelpText(err.message || 'Something went wrong');
        }
    };

    const handleCodeChange = () => {
        if (validateStatus || helpText) {
            setValidateStatus('');
            setHelpText('');
        }
    };

    return (
    <Drawer
        className='content-drawer'
        title={null}
        placement="right"
        closable={false}
        open={open} 
        getContainer={false} // 挂在 Content 内
    >
        <div className='drawer-header'>
            <Title level={4} 
                style={{color: 'white', margin: 0}}> 
                    Cart ({itemCount})
            </Title>
            <Button type="text" 
                style={{color:'white'}}
                icon={<CloseOutlined />} 
                onClick={onClose} />
        </div>

        <div className="drawer-body-scroll">
            <div>
                { cartItems.map((item) => (
                    <CartItemCard key={item.product._id} item={item} />
                ))}
            </div>
            <div className='promo-code-container'>
                <p>Apply Discount Code</p>
                <Form 
                    form={form}  
                    layout='horizontal'
                    onFinish={handleApplyCode}
                >
                    <Form.Item 
                        name='promo'
                        validateStatus={validateStatus}
                        help={helpText}
                    >
                        <Input 
                        size='large'
                        type='text'
                        placeholder='enter your code'
                        onChange={handleCodeChange} 
                        />
                    </Form.Item>
                    <Button 
                        size='large'
                        htmlType="submit"
                        type='primary'
                    > 
                        Apply 
                    </Button>
                </Form> 
            </div>

            <Divider />
            <div className='cart-footer'>
                <div className='check-out-text'>
                    <p>Subtotal</p>
                    <p>${parseFloat(subtotal).toFixed(2)}</p>
                </div>
                <div className='check-out-text'>
                    <p>Tax</p>
                    <p>${parseFloat(tax).toFixed(2)}</p>
                </div>
                <div className='check-out-text'>
                    <p>Discount</p>
                    <p>{ (discount && discount> 0) ? ('-$'+ parseFloat(discount).toFixed(2)) : '--'}</p>
                </div>
                <div className='check-out-text'>
                    <p>Estimated total</p>
                    <p>${parseFloat(total).toFixed(2)}</p>
                </div>
                <Button size='large' onClick={()=> console.log(`Your total is ${total}`)}
                > Continue to checkout </Button>
            </div>
         </div>
    </Drawer>
)};

export default CheckoutPage;