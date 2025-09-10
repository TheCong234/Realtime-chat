import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 ">
        {/*Left: Form */}
        <div className="p-8 bg-white rounded-xl shadow-md">
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

        {/*Right: Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gray-50 p-8">
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
