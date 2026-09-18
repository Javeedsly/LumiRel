import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Ad ən azı 3 simvol olmalıdır!")
    .required("Ad daxil edilməlidir!"),
  email: Yup.string()
    .email("Düzgün email daxil edin!")
    .required("Email daxil edilməlidir!"),
  password: Yup.string()
    .min(6, "Şifrə ən azı 6 simvol olmalıdır!")
    .required("Şifrə daxil edilməlidir!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Şifrələr uyğun deyil!")
    .required("Şifrəni təkrar daxil edin!"),
});
