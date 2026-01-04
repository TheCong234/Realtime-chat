"use client";
import Image from "next/image";
import { OtpInputDialog } from "./components/OtpInputDialog";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-center">
          <Image src="/assets/icons/window.svg" className="h-5 w-4" alt="Google icon" width={20} height={20} />
          <span className="ml-2 text-3xl font-bold text-gray-700">CoongChat</span>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-md">
          <h3 className="mb-2 text-xl font-bold">Quên mật khẩu của bạn?</h3>
          <h1 className="mb-2 text-2xl font-bold">Thiết lập lại mật khẩu của bạn</h1>
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-gray-500">
              Nhập email đã đăng ký của bạn và chúng tôi sẽ gửi cho bạn mã OTP để xác thực và tiến hành thay đổi mật
              khẩu.
            </p>
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/*Submit */}
          <button
            className="mt-6 w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
            onClick={() => setOpenOtpDialog(true)}
          >
            Xác nhận
          </button>

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
        </div>
      </div>
      <OtpInputDialog open={openOtpDialog} onOpenChange={setOpenOtpDialog} />
    </div>
  );
};

export default ForgotPasswordPage;
