import * as Yup from "yup";

export const paymentSchema = Yup.object({
  cardNumber: Yup.string()
    .matches(/^[0-9]{16}$/, "Kart nömrəsi 16 rəqəm olmalıdır!")
    .required("Kart nömrəsi vacibdir!"),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Tarix MM/YY formatında olmalıdır!")
    .required("Son istifadə tarixi vacibdir!"),
  cvv: Yup.string()
    .matches(/^[0-9]{3}$/, "CVV 3 rəqəm olmalıdır!")
    .required("CVV kodu vacibdir!"),
});
