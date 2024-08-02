import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom toast function
export const showToast = (message, type) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      break;
    case 'error':
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      break;
    default:
      toast.info(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
  }
};
