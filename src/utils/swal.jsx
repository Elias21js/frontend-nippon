import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "toast-glass",
    timerProgressBar: "progress-glass",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const getStyleInputs = `
.swal2-popup .label-float {
  position: relative;
  padding-top: 13px;
  margin-bottom: 15px;
}

.swal2-popup .label-float input {
  border: 1px solid lightgrey;
  border-radius: 5px;
  outline: none;
  width: 70%;
  padding: 15px 20px;
  font-size: 16px;
  background-color: transparent;
}

.swal2-popup .label-float input:focus {
  border: 2px solid #3951b2;
}

.swal2-popup .label-float input::placeholder {
  color: transparent;
  background-color: transparent;
}

.swal2-popup .label-float label {
  pointer-events: none;
  position: absolute;
  top: calc(50% - 8px);
  left: 85px;
  transition: all 0.1s linear;
  background-color: transparent;
  padding: 2px 5px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
}

.swal2-popup .label-float input:focus + label,
.swal2-popup .label-float input:not(:placeholder-shown) + label {
  font-size: 13px;
  top: 2px;
  color: #60a5fa;
  background-color: #111827;
}
`;
