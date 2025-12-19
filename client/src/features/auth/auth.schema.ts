import * as yup from "yup";

export const loginSchema = yup.object({
  usernameOrEmail: yup.string().required("Email hoặc tên người dùng là bắt buộc"),
  password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu là bắt buộc"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
