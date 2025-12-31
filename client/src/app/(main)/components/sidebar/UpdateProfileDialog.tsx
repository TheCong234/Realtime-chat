"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IMAGE_DOMAIN } from "@/environments";
import { updateProfileSchema, UpdateProfileFormValues } from "@/features/user/user.schema";
import { updateProfileRequest } from "@/features/user/user.slice";
import { RootState } from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { CameraIcon, Loader2 } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

interface UpdateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateProfileDialog({ open, onOpenChange }: UpdateProfileDialogProps) {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { updateProfileStatus } = useSelector((state: RootState) => state.user);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<UpdateProfileFormValues>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
      });
      setPreviewUrl(IMAGE_DOMAIN + user.avatarUrl);
      setAvatarFile(null);
    }
  }, [user, open, form]);

  useEffect(() => {
    if (updateProfileStatus === "success") {
      onOpenChange(false);
    }
  }, [updateProfileStatus, onOpenChange]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = (values: UpdateProfileFormValues) => {
    if (!user) return;
    dispatch(updateProfileRequest({ values, avatarFile }));
  };

  const isLoading = updateProfileStatus === "loading";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hồ sơ cá nhân</DialogTitle>
          <DialogDescription>Cập nhật thông tin cá nhân của bạn tại đây.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 py-4">
              <div className="flex flex-col items-center gap-4">
                <div className="group relative cursor-pointer">
                  <Avatar className="h-24 w-24 border border-gray-200">
                    <AvatarImage src={previewUrl || ""} alt="Avatar" />
                    <AvatarFallback>{user?.fullName?.charAt(0) || user?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <CameraIcon className="h-8 w-8 text-white" />
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
                <p className="text-muted-foreground text-sm">Nhấn vào ảnh để thay đổi</p>
              </div>

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ và tên" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
