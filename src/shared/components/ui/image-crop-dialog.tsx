import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Slider } from "./slider";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { cn } from "@/shared/lib/utils/mergeClass";

export interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
}

interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
  cropShape = "round",
}: ImageCropDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState<Crop>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize crop to center when image loads
  useEffect(() => {
    if (imageLoaded && imageRef.current && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const image = imageRef.current.getBoundingClientRect();

      // Calculate crop size (30% of container or image, whichever is smaller)
      const cropSize = Math.min(
        container.width * 0.3,
        container.height * 0.3,
        image.width * 0.5,
        image.height * 0.5
      );

      const width = cropSize;
      const height = cropSize / aspectRatio;

      // Center the crop box relative to the container
      const x = (container.width - width) / 2;
      const y = (container.height - height) / 2;

      setCrop({ x, y, width, height });
    }
  }, [imageLoaded, aspectRatio]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
    },
    [crop]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // Constrain to container bounds
      newX = Math.max(0, Math.min(newX, container.width - crop.width));
      newY = Math.max(0, Math.min(newY, container.height - crop.height));

      setCrop({ ...crop, x: newX, y: newY });
    },
    [isDragging, dragStart, crop]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getCroppedImg = useCallback(async (): Promise<File | null> => {
    const image = imageRef.current;
    const container = containerRef.current;
    if (!image || !container) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Get the displayed image dimensions
    const imageRect = image.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate the scale factors between displayed and natural image size
    const scaleX = image.naturalWidth / imageRect.width;
    const scaleY = image.naturalHeight / imageRect.height;

    // Calculate crop position relative to the displayed image
    // We need to account for the image position within the container
    const imageOffsetX = (containerRect.width - imageRect.width) / 2;
    const imageOffsetY = (containerRect.height - imageRect.height) / 2;

    // Adjust crop coordinates relative to image (not container)
    const cropX = (crop.x - imageOffsetX) * scaleX;
    const cropY = (crop.y - imageOffsetY) * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    // Set canvas size to desired output size
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Handle rotation
    if (rotation !== 0) {
      // Save context state
      ctx.save();

      // Move to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);

      // Move back
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }

    // Draw the cropped portion of the image
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Restore context if rotated
    if (rotation !== 0) {
      ctx.restore();
    }

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
          resolve(file);
        },
        "image/jpeg",
        0.95
      );
    });
  }, [crop, rotation]);

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg();
    if (croppedImage) {
      onCropComplete(croppedImage);
      onOpenChange(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Container */}
          <div
            ref={containerRef}
            className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="max-w-full max-h-full object-contain"
              onLoad={handleImageLoad}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: isDragging ? "none" : "transform 0.2s",
              }}
            />

            {/* Crop Overlay */}
            <div
              className={cn(
                "absolute border-2 border-white shadow-lg cursor-move",
                cropShape === "round" ? "rounded-full" : "rounded-lg"
              )}
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Corner Handles */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-nw-resize" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-ne-resize" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-sw-resize" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-se-resize" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  Zoom
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Rotation Control */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <RotateCw className="h-4 w-4" />
                Rotation
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRotate}
              >
                Rotate 90°
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleCrop}>
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
