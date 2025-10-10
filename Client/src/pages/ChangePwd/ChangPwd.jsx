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
    Alert
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';

export const ChangePwdPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); 
    const [form] = Form.useForm();
    const [isSent, setIsSent] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        console.log(values)
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await axios.post(
                "http://localhost:3000/api/user/forgot-password",
                values,
                { withCredentials: true }
            )
            if (res.data.status === 'success') {
                setIsSent(true);
            } else {
                setErrorMessage(res.data.message || "Something went wrong, please try again.");
            }
        } catch (err) {
            if (err.response && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                setErrorMessage("Unable to send reset link. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <MainLayout>
            <div className="changePwdPage">
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
                    <p>We have sent the update password link to your email, please check that !</p>
                </Card>
                }
            </div>
        </MainLayout>
        
  );
};