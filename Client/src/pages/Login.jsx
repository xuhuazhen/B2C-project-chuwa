import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import MainLayout from '../components/UI/mainLayout';
import { message } from 'antd'; 
import 'antd/dist/reset.css'; 
import api from '../api';
import { AuthForm } from '../components/AuthForm/authForm';

const LoginPage = () => {
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
  
    const handleSubmit = async (values) => { 
        setLoading(true);

        try {
           const res = await api.post(
                "user/login",
                values,
                { withCredentials: true, credentials: "include" }
            );     

            if (res.data.status === "success") {
                // const { cart, ...userInfo } = res.data.data.user;
                // dispatch(storeUser(userInfo));

                // // 如果未登录前添加购物车
                // if ( curCart.length !== 0 && cart.length === 0 ) {
                //     dispatch(updateCartThunk(curCart));
                // } else {
                //     dispatch(storeCartItems(cart)); //后期可修改成merge cart
                // }
                message.success('Welcome back!');
                navigate('/', { replace: true });
            }  
        } catch (err) {
            if (err.response && err.response.data.message) message.error(err.response.data.message);
            else message.error(err.message); 
        } finally {
            setLoading(false);
        }
  };
  
    return (
        <MainLayout>
            <AuthForm 
                title='Sign in to your accoun' 
                fields={[
                {
                    name: 'email',
                    label: 'Email',
                    placeholder: 'Enter your email',
                    rules: [
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Invalid email format!' },
                    ],
                },
                {
                    name: 'password',
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Enter your password',
                    rules: [{ required: true, message: 'Please enter your password!' }],
                },
                ]}
                buttonText='Log In'
                loading={loading} 
                onSubmit={handleSubmit}
                footer='logIn'
            > 

            </AuthForm>
        </MainLayout>
        
  );
};

export default LoginPage;
