"use client";
import Image from "next/image";
import "../../globals.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "@/features/auth/auth.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { clearAuthError, registerRequest, resetRegisterStatus } from "@/features/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error, registerStatus } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    dispatch(registerRequest(data));
  };

  useEffect(() => {
    if (registerStatus === "success") {
      dispatch(resetRegisterStatus());
      toast.success("Đăng ký thành công", {
        description: "Bạn được chuyển tới trang chủ",
      });
      router.replace("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [registerStatus, error, dispatch, router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2">
        {/*left description */}
        <div className="hidden bg-gray-50 p-8 md:block">
          <div className="mb-6 flex items-center">
            <Image src="/assets/icons/window.svg" className="h-5 w-4" alt="Google icon" width={20} height={20} />
            <span className="ml-2 text-2xl font-bold text-gray-700">CoongChat</span>
          </div>
          <div className="flex gap-2">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-1"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12ZM15.7127 10.7197C16.0055 10.4268 16.0055 9.95192 15.7127 9.65903C15.4198 9.36614 14.9449 9.36614 14.652 9.65903L10.9397 13.3713L9.34869 11.7804C9.0558 11.4875 8.58092 11.4875 8.28803 11.7804C7.99514 12.0732 7.99514 12.5481 8.28803 12.841L10.4093 14.9623C10.7022 15.2552 11.1771 15.2552 11.47 14.9623L15.7127 10.7197Z"
                  fill="#3A52EE"
                ></path>
              </g>
            </svg>
            <div>
              <h3 className="text-xl font-bold">Get started quickly</h3>
              <p className="text-secondary">Integrate with developer-friendly APIs or choose low-code.</p>
            </div>
          </div>
          <div className="mt-8 flex gap-2">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-1"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12ZM15.7127 10.7197C16.0055 10.4268 16.0055 9.95192 15.7127 9.65903C15.4198 9.36614 14.9449 9.36614 14.652 9.65903L10.9397 13.3713L9.34869 11.7804C9.0558 11.4875 8.58092 11.4875 8.28803 11.7804C7.99514 12.0732 7.99514 12.5481 8.28803 12.841L10.4093 14.9623C10.7022 15.2552 11.1771 15.2552 11.47 14.9623L15.7127 10.7197Z"
                  fill="#3A52EE"
                ></path>
              </g>
            </svg>
            <div>
              <h3 className="text-xl font-bold">Get started quickly</h3>
              <p className="text-secondary">Integrate with developer-friendly APIs or choose low-code.</p>
            </div>
          </div>
          <div className="mt-8 flex gap-2">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-1"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12ZM15.7127 10.7197C16.0055 10.4268 16.0055 9.95192 15.7127 9.65903C15.4198 9.36614 14.9449 9.36614 14.652 9.65903L10.9397 13.3713L9.34869 11.7804C9.0558 11.4875 8.58092 11.4875 8.28803 11.7804C7.99514 12.0732 7.99514 12.5481 8.28803 12.841L10.4093 14.9623C10.7022 15.2552 11.1771 15.2552 11.47 14.9623L15.7127 10.7197Z"
                  fill="#3A52EE"
                ></path>
              </g>
            </svg>
            <div>
              <h3 className="text-xl font-bold">Get started quickly</h3>
              <p className="text-secondary">Integrate with developer-friendly APIs or choose low-code.</p>
            </div>
          </div>
        </div>

        {/*Right: Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Card className="rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Đăng ký 1 tài khoản để lưu giữ các câu chuyện của bạn</CardTitle>
              <CardDescription>
                Bắt đầu chat trong thoáng chốc. Bạn đã có tài khoản?{" "}
                <Link href="/login" className="text-primary font-medium">
                  Đăng nhập
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {/* Full name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Tên đầy đủ</Label>
                  <Input id="fullName" placeholder="Nguyễn Văn A" {...register("fullName")} />
                  {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input id="username" placeholder="username" {...register("username")} />
                  {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@gmail.com" {...register("email")} />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                  {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
                  {errors.confirmPassword && (
                    <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Remember me */}
              <div className="mt-4 flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
                {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground text-sm">or</span>
                <Separator className="flex-1" />
              </div>

              {/* Social login */}
              <Button variant="outline" className="mb-3 w-full gap-2" type="button">
                <Image src="/assets/icons/google.svg" alt="Google" width={20} height={20} />
                Đăng nhập với Google
              </Button>

              <Button variant="outline" className="w-full gap-2" type="button">
                <Image src="/assets/icons/facebook-color.svg" alt="Facebook" width={20} height={20} />
                Đăng nhập với Facebook
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
