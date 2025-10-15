import React from 'react';
import { Button, message, Space } from 'antd';

export const messageAlert = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
        type: 'success',
        content: 'This is a success message',
        });
    };

     const error = () => {
        messageApi.open({
        type: 'error',
        content: 'This is an error message',
        });
    };

    const warning = () => {
        messageApi.open({
        type: 'warning',
        content: 'This is a warning message',
        });
    };

    return (
        <>
        {contextHolder}
        </>
    );
};
 