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
import { Camera, Upload, Loader2 } from "lucide-react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("無法存取相機。請確保已授予相機權限。");
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL("image/jpeg");

    await handleImageAnalysis(base64Image);
    stopCamera();
  };

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      await handleImageAnalysis(base64Image);
    };
    reader.readAsDataURL(file);
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
          stopCamera();
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

        {showCamera ? (
          <div className="space-y-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="flex justify-center">
              <Button onClick={capturePhoto}>拍照</Button>
            </div>
          </div>
        ) : uploadedImage ? (
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
