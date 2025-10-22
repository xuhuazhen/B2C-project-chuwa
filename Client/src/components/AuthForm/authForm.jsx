import { Form, Input, Button, Card, Switch } from 'antd';
import {
    CloseOutlined,
    MailTwoTone
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './style.css';

export const AuthForm = ({
    title,
    subtitle,
    fields=[],
    buttonText,
    loading,
    onSubmit, 
    footer='',
    }) => {
    
        const [form] = Form.useForm();
        const navigate = useNavigate();

        return (
            <div className="authPage">
                <Card title={
                    <div className='card-header'>
                        <Button type="text"
                            icon={<CloseOutlined />}
                            onClick={() => navigate('/')}
                        />        
                        <span>{title}</span> 
                        {/* update password subtitle */}
                        { subtitle && 
                            <span style={{fontSize: 14, fontWeight: 'normal'}}> 
                                {subtitle}
                            </span>
                        }
                    </div>
                } 
                >
                  { fields && fields.length > 0 && (
                    <Form 
                        form={form} 
                        layout='vertical'
                        onFinish={onSubmit}
                        autoComplete='off'
                    >
                        { fields.map((field) => {
                           
                            if (field.type === 'switch') {
                                return (
                                    <Form.Item
                                    key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    valuePropName="checked"
                                    >
                                    <Switch
                                        checkedChildren="Yes"
                                        unCheckedChildren="No"
                                        defaultChecked={field.defaultChecked}
                                    />
                                    </Form.Item>
                                );
                            } 
                            
                            return (
                                <Form.Item key={field.name}
                                    name={field.name}
                                    label={field.label}
                                    rules={field.rules}
                                >
                                    { field.type === 'password' ?
                                        <Input.Password placeholder={field.placeholder} /> 
                                        :
                                        <Input placeholder={field.placeholder} />
                                    }
                                </Form.Item>
                            );
                        })} 

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                            >
                               {buttonText}
                            </Button>
                        </Form.Item>
                    </Form>
                    )}

                    { footer && footer === 'logIn' && (
                        <div className='login-footer'>
                            <span style={{marginRight: 10}}>
                                Don't have an account?{' '}
                                <a onClick={() => navigate('/signup')}>Sign Up</a>
                            </span>
                            <span>
                                <a onClick={() => navigate('/forget-pwd')}>Forget password?</a>
                            </span>
                        </div>
                    )}
                    {footer && footer === 'signUp' && (
                        <span>
                            Already have an account?{' '}
                            <a onClick={() => navigate('/login')}> Log In </a>
                        </span> 
                    )}
                    { footer && footer === 'sentEmail' &&  (
                        <div className='email-sent-content'>
                            <MailTwoTone style={{fontSize: 40}}/>
                            <p>We have sent the update password link to your email, please check that !</p>
                        </div>
                    )}
                </Card>
            </div>
        );
}