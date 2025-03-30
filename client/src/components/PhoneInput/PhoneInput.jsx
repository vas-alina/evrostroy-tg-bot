import React, { useState } from "react";

const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, "").slice(0, 11); // Убираем всё кроме цифр (ограничение 11 символов)
  
  let formatted = "+7";  
  if (numbers.length > 1) formatted += numbers.substring(1, 4);
  if (numbers.length > 4) formatted += "-" + numbers.substring(4, 7);
  if (numbers.length > 7) formatted += "-" + numbers.substring(7, 9);
  if (numbers.length > 9) formatted += "-" + numbers.substring(9, 11);

  return formatted;
};

const PhoneInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    onChange(formattedValue);
  };

  return (
    <input
      type="tel"
      value={value}
      onChange={handleChange}
      placeholder="+7___-___-__-__"
      className="phone-input"
    />
  );
};

export default PhoneInput;
// import React from "react";


// import InputMask from "react-input-mask";

// const PhoneInput = ({ value, onChange }) => {
//   return (
//     <InputMask
//       mask="7999-999-99-99"
//       placeholder="+7___-___-__-__"
//       value={value}
//       onChange={onChange}
//     >
//       <input type="tel" className="phone-input" />
//     </InputMask>
//   );
// };

// export default PhoneInput;