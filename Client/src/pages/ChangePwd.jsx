import { useState } from 'react';  
import MainLayout from '../components/UI/mainLayout';
import { Card, Button, message } from 'antd';
import api from '../api';
import { AuthForm } from '../components/AuthForm/authForm'; 
import '../components/AuthForm/style.css';

const ChangePwdPage = () => {
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);  

    const handleSubmit = async (values) => {
        console.log(values)
        setLoading(true);

        try {
            const res = await api.post( "user/forgot-password",
                values,
                { withCredentials: true }
            )
            if (res.data.status === 'success') {
                setIsSent(true);
            }  
        } catch (err) {
            if (err.response && err.response.data.message) {
                message.error(err.response.data.message);
            } else {
                message.error("Unable to send reset link. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <MainLayout>
            {!isSent ? (
                <AuthForm
                title="Update your password"
                subtitle="Enter your email, we will send you a recovery link"
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
                ]}
                buttonText="Send Reset Link"
                loading={loading}
                onSubmit={handleSubmit}
                />
            ) : (
                <AuthForm footer='sentEmail'></AuthForm>
            )}

            {/* <div className="authPage">
                { !isSent && <Card title={
                    <div className='card-header'>
                        <Button type="text"
                            icon={<CloseOutlined />}
                            onClick={() => navigate('/')}
                        />        
                        <span>Update your password</span>
                        <span style={{fontSize: 14, fontWeight: 'normal'}}> Enter your email link, we will send you recovery link</span>
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
                </Card>
                }
                { isSent && <Card title={
                    <div className='card-header'>
                        <Button type="text"
                            icon={<CloseOutlined />}
                            onClick={() => navigate('/')}
                        />        
                    </div>
                    }
                    >
                    <div className='email-sent-content'>
                        <MailTwoTone style={{fontSize: 40}}/>
                        <p>We have sent the update password link to your email, please check that !</p>
                    </div>
                </Card>
                }
            </div> */}
        </MainLayout>
        
  );
};

export default ChangePwdPage;