import { useEffect, useState } from "react";
import PhoneInput from "../PhoneInput/PhoneInput";
import "./Form.css";
import { useTelegram } from "../../hooks/useTelegram";

const Form = () => {
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("+7");
  const tg = useTelegram();
  console.log(tg);

  useEffect(() => {
    if (tg?.MainButton) {
      tg.MainButton.setParams({ text: "Отправить заявку" });
    }
  }, [tg]);

  useEffect(() => {
    if (tg?.MainButton) {
      if (!city || !phone || !area) {
        tg.MainButton.hide();
      } else {
        tg.MainButton.show();
      }
    }
  }, [city, area, phone]);

  return (
    <div className="form">
      <h3 className="form-title">Введите данные для заявки</h3>
      <div className="form-data">
        <label>Выберите регион:</label>
        <select
          className="select"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="krasnodar">Краснодар и край</option>
          <option value="sochi">Сочи</option>
          <option value="rostov">Ростов-на-Дону и область</option>
          <option value="other">Другой</option>
        </select>

        <label>Введите населенный пункт:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Например, Анапа..."
        />

        <label>Метраж в м²:</label>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Примерно..."
        />

        <label>Номер телефона:</label>
        <PhoneInput value={phone} onChange={setPhone} />
      </div>
    </div>
  );
};

export default Form;
