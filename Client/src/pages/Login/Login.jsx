import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './style.css';
import MainLayout from '../../components/UI/mainLayout';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Alert
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    
    const handleSubmit = async (values) => { 
        setLoading(true);

        try {
           const res = await axios.post(
                "http://localhost:3000/api/user/login",
                values,
                { withCredentials: true, credentials: "include" }
            );     

            if (res.data.status === "success") {
                const user = res.data.data.user;
                console.log(user);
            } else { 
               message.error("Login failed. Please check your credentials and try again.");
            }
        } catch (err) {
            if (err.response && err.response.data.message) setErrorMessage(err.response.data.message);
            else setErrorMessage(err.message); 
        } finally {
            setLoading(false);
        }
  };
  
    return (
        <MainLayout>
            <div className="loginPage">
                <Card title={
                    <div className='card-header'>
                        <Button type="text"
                            icon={<CloseOutlined />}
                            onClick={() => navigate('/')}
                        />        
                        <span>Sign in to your account</span>
                    </div>
                } 
                >
                {errorMessage && (
                    <Alert
                    message={errorMessage}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                    />
                )}
                    <Form form={form} 
                        layout='vertical'
                        onFinish={handleSubmit}
                        onValuesChange={() => setErrorMessage('')}
                        autoComplete='off'
                    >
                        <Form.Item name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Invalid email format!' },
                            ]}
                        >
                            <Input placeholder="Enter your email" />
                        </Form.Item>
                        <Form.Item name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Please enter your password!' }, 
                            ]}
                        >
                        <Input.Password placeholder="Enter your password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                                Log In
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='login-footer'>
                        <span style={{marginRight: 10}}>
                            Don't have an account?{' '}
                            <a onClick={() => navigate('/signup')}>Sign Up</a>
                        </span>
                        <span>
                            <a onClick={() => navigate('/forget-pwd')}>Forget password?</a>
                        </span>
                    </div>
                </Card>
            </div>
        </MainLayout>
        
  );
};

export default LoginPage;
