import Swal from 'sweetalert2'

// Create a reusable Toast instance for notifications
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    // Pause timer on mouse hover
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Show a success toast notification
export function alertSuccess(message){
    Toast.fire({
  icon: "success",
  title: message
});
}

// Show an error toast notification
export function alertError(message){
    Toast.fire({
    icon: "error",
    title: message
    });
}

// Example toast shown on sign in (can be removed if not needed)
Toast.fire({
  icon: "success",
  title: "Signed in successfully"
});

// Show a confirmation dialog before deleting an item
export async function confirmarEliminacion() {
  const result = await Swal.fire({
    title:"Are you sure you want to delete it?",
    text: "Remember, once deleted you will NEVER see it again!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it"
  });

  return result.isConfirmed;
}