import Image from "next/image";
import "../../globals.css";

const RegisterPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 ">
        {/*left description */}
        <div className="hidden md:block bg-gray-50 p-8">
          <div className="flex items-center mb-6">
            <Image
              src="/assets/icons/window.svg"
              className="w-4 h-5"
              alt="Google icon"
              width={20}
              height={20}
            />
            <span className="ml-2 text-xl font-bold text-gray-700">
              CoongChat
            </span>
          </div>
          <div className="flex gap-2">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
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
              <h3 className="text-lg font-bold">Get started quickly</h3>
              <p className="text-secondary">
                Integrate with developer-friendly APIs or choose low-code.
              </p>
            </div>
          </div>
        </div>

        {/*Right: Form */}
        <div className="p-8 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-2">Chào mừng quay trở lại</h1>
          <p className="text-gray-500 mb-6">
            Bắt đầu chat trong thoáng chốc. Bạn không có tài khoản?
            <a href="#" className="text-blue-600 font-medium">
              Đăng ký.
            </a>
          </p>
          <div className="flex gap-6">
            {/*Email */}
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2 ">
                Email
              </label>
              <input
                type="email"
                placeholder="name@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/*Password */}
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/*Remember + Forgot */}
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu?
            </a>
          </div>

          {/*Submit */}
          <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
            Đăng nhập
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
    </div>
  );
};

export default RegisterPage;
