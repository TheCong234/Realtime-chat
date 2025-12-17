"use client";

import Image from "next/image";
import Link from "next/link";
import { OtpInputDialog } from "./components/OtpInputDialog";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl  ">
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/assets/icons/window.svg"
            className="w-4 h-5"
            alt="Google icon"
            width={20}
            height={20}
          />
          <span className="ml-2 text-3xl font-bold text-gray-700">
            CoongChat
          </span>
        </div>
        <div className="p-8 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-bold mb-2">Quên mật khẩu của bạn?</h3>
          <h1 className="text-2xl font-bold mb-2">
            Thiết lập lại mật khẩu của bạn
          </h1>
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 mb-6">
            <p className="text-gray-500">
              Nhập email đã đăng ký của bạn và chúng tôi sẽ gửi cho bạn mã OTP
              để xác thực và tiến hành thay đổi mật khẩu.
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 ">
              Email
            </label>
            <input
              type="email"
              placeholder="name@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/*Submit */}
          <button
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            onClick={() => setOpenOtpDialog(true)}
          >
            Xác nhận
          </button>

          {/*Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/*Social Login */}
          <button className="w-full flex items-center justify-center gap-2 mb-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Image
              src="/assets/icons/google.svg"
              className="w-5 h-5"
              alt="Google icon"
              width={20}
              height={20}
            />
            Đăng nhập với Google
          </button>

          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Image
              src="/assets/icons/facebook-color.svg"
              className="w-5 h-5"
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
