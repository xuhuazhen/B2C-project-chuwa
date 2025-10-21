import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Form, Card, Input, Button, Switch, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MainLayout from '../components/UI/mainLayout'; 
import api from '../api';

const SignupPage =  () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [form] = Form.useForm();
    const navigate = useNavigate(); 

    const handleSubmit = async (values) => { 
        setLoading(true); 

        try {
           const res = await api.post( "user/signup",
                { 
                  ...values,  role: values.role ? 'admin' : 'user'
                },
                { withCredentials: true, credentials: "include" }
            );     

            if (res.data.status === "success") {
                const user = res.data.data.user;
                console.log('Signup successful!', user);
                navigate('/');
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
                <div className="authPage">
                    <Card title={
                        <div className='card-header'>
                            <Button type="text"
                                icon={<CloseOutlined />}
                                onClick={() => navigate('/')}
                            />        
                            <span>Sign up an account</span>
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
                                    { type: 'email', message: 'Invalid email input!' },
                                ]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                            <Form.Item name="password"
                                label="Password"
                                rules={[
                                    { required: true, message: 'Please enter your password!' }, 
                                    {
                                        validator: (_, value) => {
                                            if (!value) return Promise.resolve();

                                            if (value.length < 6) {
                                                return Promise.reject(new Error('Password must be at least 6 characters long.'));
                                            }
                                            if (!/[0-9]/.test(value)) {
                                                return Promise.reject(new Error('Password must include at least one number.'));
                                            }

                                            if (!/[A-Z]/.test(value)) {
                                                return Promise.reject(new Error('Password must include at least one uppercase letter.'));
                                            }

                                            if (!/[a-z]/.test(value)) {
                                                return Promise.reject(new Error('Password must include at least one lowercase letter.'));
                                            }

                                            if (!/[\W_]/.test(value)) {
                                                return Promise.reject(new Error('Password must include at least one special character.'));
                                            }

                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                            <Input.Password placeholder="Enter your password" />
                            </Form.Item>
                            <Form.Item name="role"
                                label="Are you an admin?"
                                valuePropName="checked">
                                <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked/>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                >
                                    Sign Up
                                </Button>
                            </Form.Item>
                        </Form>
                        <span>
                            Already have an account?{' '}
                            <a onClick={() => navigate('/login')}> Log In </a>
                        </span> 
                    </Card>
                </div>
            </MainLayout>
      );
};

export default SignupPage; 