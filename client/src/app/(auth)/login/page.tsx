"use client";
import { Button } from "@/components/ui/button";
import { LoginFormValues, loginSchema } from "@/features/auth/auth.schema";
import Image from "next/image";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { clearAuthError, loginRequest } from "@/features/auth/auth.slice";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading, error, loginStatus } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    dispatch(loginRequest(data));
  };

  useEffect(() => {
    if (searchParams.get("reason") === "unauthorized" && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.error("Bạn chưa đăng nhập", {
        description: "Vui lòng đăng nhập để tiếp tục",
        action: {
          label: "Ok",
          onClick: () => toast.dismiss(),
        },
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (loginStatus === "success") {
      toast.success("Đăng nhập thành công", {
        description: "Bạn được chuyển tới trang chủ",
      });
      router.replace("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [loginStatus, error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2">
        {/*Left: Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-white p-8 shadow-md" noValidate>
          <div className="mb-6 flex items-center">
            <Image src="/assets/icons/window.svg" className="h-5 w-4" alt="Google icon" width={20} height={20} />
            <span className="ml-2 text-xl font-bold text-gray-700">CoongChat</span>
          </div>

          <h1 className="mb-2 text-2xl font-bold">Chào mừng quay trở lại</h1>
          <p className="mb-6 text-gray-500">
            Bắt đầu chat trong thoáng chốc. Bạn không có tài khoản?
            <Link href="/register" className="font-medium text-blue-600">
              Đăng ký.
            </Link>
          </p>
          <div className="flex gap-6">
            {/*Email */}
            <div className="mb-4 w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">Email hoạc tên đăng nhập</label>
              <input
                type="text"
                {...register("usernameOrEmail")}
                placeholder="name@gmail.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.usernameOrEmail && <p className="text-red-500">{errors.usernameOrEmail.message}</p>}
            </div>

            {/*Password */}
            <div className="mb-4 w-full">
              <label className="mb-2 block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          {/*Remember + Forgot */}
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          {/*Submit */}
          <Button className="w-full" variant={"default"} type="submit">
            Đăng nhập
          </Button>

          {/*Divider */}
          <div className="my-4 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/*Social Login */}
          <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            <Image src="/assets/icons/google.svg" className="h-5 w-5" alt="Google icon" width={20} height={20} />
            Đăng nhập với Google
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            <Image
              src="/assets/icons/facebook-color.svg"
              className="h-5 w-5"
              alt="Google icon"
              width={20}
              height={20}
            />
            Đăng nhập với Facebook
          </button>
        </form>

        {/*Right: Illustration */}
        <div className="hidden items-center justify-center bg-gray-50 p-8 md:flex">
          <Image
            src="/assets/icons/illustration.svg"
            alt="illustration"
            className="max-h-96"
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
