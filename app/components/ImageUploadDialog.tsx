"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

interface ImageUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageUploadDialog({
  isOpen,
  onOpenChange,
}: ImageUploadDialogProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1080,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const base64Image = await convertToBase64(compressedFile);
      await handleImageAnalysis(base64Image);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("壓縮圖片時發生錯誤。請稍後再試。");
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageAnalysis = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setUploadedImage(base64Image);

    try {
      const analysisResponse = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: base64Image }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze image");
      }

      const { analysis } = await analysisResponse.json();
      setAnalysis(analysis);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("處理圖片時發生錯誤。請稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setAnalysis(null);
          setUploadedImage(null);
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-5/6 md:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>選擇圖片來源</DialogTitle>
          <DialogDescription>
            分析你看到的商品資訊、日幣價格等..
          </DialogDescription>
        </DialogHeader>

        {uploadedImage ? (
          <div className="space-y-4">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-auto rounded-lg object-contain max-h-[400px]"
            />
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedImage(null);
                  setAnalysis(null);
                }}
              >
                重新上傳
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-24"
                onClick={handleUploadImage}
                disabled={isAnalyzing}
              >
                <Upload className="h-8 w-8" />
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </>
        )}

        {isAnalyzing && (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">正在分析圖片...</p>
          </div>
        )}

        {analysis && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">AI 分析結果：</h3>
            <p className="text-sm whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
