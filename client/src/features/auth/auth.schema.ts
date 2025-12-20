import * as yup from "yup";

export const loginSchema = yup.object({
  usernameOrEmail: yup.string().required("Email hoặc tên người dùng là bắt buộc"),
  password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Mật khẩu là bắt buộc"),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
    .max(50, "Tên đăng nhập tối đa 50 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Tên đăng nhập không được chứa ký tự đặc biệt")
    .required("Tên đăng nhập là bắt buộc"),
  fullName: yup
    .string()
    .trim()
    .min(3, "Tên đầy đủ tối thiểu 3 ký tự")
    .max(100, "Tên đầy đủ tối đa 100 ký tự")
    .default(""),
  email: yup
    .string()
    .trim()
    .email("Email không hợp lệ")
    .max(150, "Email tối đa 150 ký tự")
    .required("Email là bắt buộc"),

  password: yup
    .string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự")
    .required("Mật khẩu là bắt buộc"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
