// utils/password.js or inside employee.controller.js
export function generateTempPassword(length = 5) {
  const charset = "bhdbsvhjjksndkj87y8ds67gds8vhsndu9vsd7865dvs4d3v5ds67v";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
