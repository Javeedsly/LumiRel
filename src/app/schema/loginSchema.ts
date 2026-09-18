import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Düzgün email daxil edin")
    .required("Email boş ola bilməz"),
  password: Yup.string()
    .min(6, "Şifrə ən azı 6 simvol olmalıdır")
    .required("Şifrə boş ola bilməz"),
});
