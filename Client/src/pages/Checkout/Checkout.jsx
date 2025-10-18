import { useState } from 'react';  
import './style.css';
import MainLayout from '../../components/UI/mainLayout';
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
            const action = await dispatch(validatePromoCodeThunk(codeInput));

            if (validatePromoCodeThunk.rejected.match(action)) { 
                setValidateStatus('error');
                setHelpText(action.payload?.message);
            }   
        } catch {
            setValidateStatus('error');
            setHelpText('Something went wrong');
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
                <p>${subtotal}</p>
            </div>
            <div className='check-out-text'>
                <p>Tax</p>
                <p>${tax}</p>
            </div>
            <div className='check-out-text'>
                <p>Discount</p>
                <p>{ (discount && discount> 0) ? ('-$'+ discount) : '--'}</p>
            </div>
            <div className='check-out-text'>
                <p>Estimated total</p>
                <p>${total}</p>
            </div>
            <Button size='large'> Continue to checkout </Button>
        </div>
    </Drawer>
)};

export default CheckoutPage;