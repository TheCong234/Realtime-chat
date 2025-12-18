import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OtpInputDialog({ open, onOpenChange }: OtpInputDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thay đổi Mật khẩu</DialogTitle>
          <DialogDescription>
            1 mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã
            OTP để xác thực và mật khẩu mới để tiến hành thay đổi mật khẩu.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="flex justify-end text-sm gap-2 w-full ">
          <p>Bạn không nhận được Email?</p>
          <span className="text-gray-500 font-bold">04:01</span>
          <span className="text-blue-600 hover:underline">Gửi lại</span>
        </div>
        <div className="mb-2 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Nhập lại Mật khẩu
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button variant={"default"} onClick={() => onOpenChange(false)}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
