import { useState } from 'react';  
import './style.css';
import {
    Input,
    Drawer,
    Divider,
    Button,
    Typography,  
    Form,
    message,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { CartItemCard } from '../../components/CartItemCard/cartItemCard';

import { useSelector, useDispatch } from "react-redux";
import { subTotalPrice, 
    totalCartItem, 
    totalPrice, 
    discountAmount, 
    totalTax } from '../../store/cart/cartSelectors';
import { validatePromoCodeThunk } from '../../store/cart/cartThunk';
import api from '../../api';

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
    const [promocode, setPromoCode] = useState(null);
    const [outOfStockIds, setOutOfStockIds] = useState([]);
    
    const handleCheckOut = async() => { 
        try {
            const items = cartItems.map(i => ({
                product: i.product._id, 
                quantity: i.quantity
            }))
            const res = await api.post('/user/checkout', 
                { code: promocode, cartItems: items},
                { withCredentials: true });
                console.log(res)
            if (res.data.status === 'success') {
                console.log(`checkout success. total is ${total}`);
                setOutOfStockIds([]);
            }
        } catch (err) {
            if (err.response && err.response.data) {
                console.log(err.response.data);
                setOutOfStockIds(err.response.data.data);
            }
            else message.error(err.message);
        }
    }

    const handleApplyCode = async() => {
        setPromoCode(null);
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
            setPromoCode(codeInput);
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
                    <CartItemCard 
                        key={item.product._id} 
                        item={item} 
                        isOutOfStock={outOfStockIds.includes(item.product._id)}
                    />
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
                <Button size='large' onClick={handleCheckOut}
                > Continue to checkout </Button>
            </div>
         </div>
    </Drawer>
)};

export default CheckoutPage;