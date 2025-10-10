import './style.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Card, Input, Button, Switch, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MainLayout from '../../components/UI/mainLayout'; 

const SignupPage =  () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [form] = Form.useForm();
    const navigate = useNavigate(); 

    const handleSubmit = async (values) => { 
        setLoading(true); 

        try {
           const res = await axios.post(
                "http://localhost:3000/api/user/signup",
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
                <div className="signupPage">
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
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/,
                                        message: 'Invalid password input!'
                                    }
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