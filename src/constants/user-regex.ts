export const PASSWORD_REG_EX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/;
export const PHONE_NUMBER_REG_EX =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const USER_NAME_REG_EX = /^[a-z ,.'-]+$/i;
