import { message } from 'antd';

export const initGlobalMessage = ({ headerId = '#app-header', offset = 0, maxCount = 3 } = {}) => {
    let top = offset;

    const headerEl = document.querySelector(headerId);
        if (headerEl) {
            top = headerEl.offsetHeight + offset;
        }

        message.config({
            top,
            maxCount: maxCount || 3,
  });
};