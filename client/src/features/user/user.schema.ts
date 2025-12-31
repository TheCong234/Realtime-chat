import * as yup from "yup";

export const updateProfileSchema = yup.object().shape({
  fullName: yup.string().max(50, "Họ tên không được quá 50 ký tự").default(""),
  phoneNumber: yup
    .string()
    .matches(/(0[3|5|7|8|9])+([0-9]{8})\b/g, {
      message: "Số điện thoại không hợp lệ",
      excludeEmptyString: true,
    })
    .default(""),
});

export type UpdateProfileFormValues = yup.InferType<typeof updateProfileSchema>;
