import Swal from 'sweetalert2';

// Helper para mostrar alertas de éxito
export const showSuccessAlert = (title, text) => {
    return Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Aceptar'
    });
};

// Helper para mostrar alertas de error
export const showErrorAlert = (title, text) => {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Aceptar'
    });
};

// Toast (notificación pequeña en la esquina)
export const showToast = (icon, title) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    return Toast.fire({
        icon: icon,
        title: title
    });
};
