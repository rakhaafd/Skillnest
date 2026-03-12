import Swal from 'sweetalert2';

const Alert = {
  confirm: ({
    title = 'Apakah kamu yakin?',
    text = '',
    confirmText = 'Ya',
    cancelText = 'Batal',
    confirmColor = '#ef4444',
    cancelColor = '#6b7280',
    icon = 'warning',
  } = {}) => {
    return Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: cancelColor,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
  },

  show: ({
    title = '',
    text = '',
    icon = 'info',
    timer = null,
    showConfirmButton = true,
  } = {}) => {
    return Swal.fire({
      title,
      text,
      icon,
      timer,
      showConfirmButton: timer ? false : showConfirmButton,
    });
  },
};

export default Alert;