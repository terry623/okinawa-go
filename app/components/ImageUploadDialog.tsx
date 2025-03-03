"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Camera, Upload } from "lucide-react";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageUploadDialog({
  isOpen,
  onOpenChange,
}: ImageUploadDialogProps) {
  const handleTakePhoto = () => {
    // TODO: Implement photo capture functionality
    console.log("Take photo clicked");
  };

  const handleUploadImage = () => {
    // TODO: Implement image upload functionality
    console.log("Upload image clicked");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-5/6 rounded-lg">
        <DialogHeader>
          <DialogTitle>選擇圖片來源</DialogTitle>
          <DialogDescription>
            請選擇要使用相機拍照或從裝置上傳圖片
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-24"
            onClick={handleTakePhoto}
          >
            <Camera className="h-8 w-8" />
            <span>拍照</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-24"
            onClick={handleUploadImage}
          >
            <Upload className="h-8 w-8" />
            <span>上傳圖片</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
