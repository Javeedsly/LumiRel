import * as Yup from "yup";

export const RegisterSchema =
  Yup.object({
    name:
      Yup.string()
        .min(
          3,
          "Ad ən azı 3 simvol olmalıdır!"
        )
        .required(
          "Ad daxil edilməlidir!"
        ),

    surname:
      Yup.string()
        .min(
          2,
          "Soyad ən azı 2 simvol olmalıdır!"
        )
        .required(
          "Soyad daxil edilməlidir!"
        ),

    email:
      Yup.string()
        .email(
          "Düzgün email daxil edin!"
        )
        .required(
          "Email daxil edilməlidir!"
        ),

    password:
      Yup.string()
        .min(
          6,
          "Şifrə ən azı 6 simvol olmalıdır!"
        )
        .required(
          "Şifrə daxil edilməlidir!"
        ),

    confirmPassword:
      Yup.string()
        .oneOf(
          [
            Yup.ref(
              "password"
            ),
          ],
          "Şifrələr uyğun deyil!"
        )
        .required(
          "Şifrəni təkrar daxil edin!"
        ),
  });