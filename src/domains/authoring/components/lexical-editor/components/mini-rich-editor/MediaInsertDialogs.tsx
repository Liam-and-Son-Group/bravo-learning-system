/**
 * Media Insert Dialogs
 * Provides UI for inserting images, videos, and audio
 */

import { useState, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { uploadFile } from "@/shared/lib/axios";
import type { MediaInsertDialogsProps } from "./types";

export function MediaInsertDialogs({
  showImageDialog,
  showVideoDialog,
  showAudioDialog,
  onClose,
  onImageInsert,
  onVideoInsert,
  onAudioInsert,
}: MediaInsertDialogsProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);

  const handleImageSubmit = () => {
    if (imageUrl.trim()) {
      onImageInsert(imageUrl);
      setImageUrl("");
      onClose();
    }
  };

  const handleVideoSubmit = () => {
    if (videoUrl.trim()) {
      onVideoInsert(videoUrl);
      setVideoUrl("");
      onClose();
    }
  };

  const handleAudioSubmit = () => {
    if (audioUrl.trim()) {
      onAudioInsert(audioUrl);
      setAudioUrl("");
      onClose();
    }
  };

  const handleFileUpload = async (
    file: File,
    onInsert: (url: string) => void
  ) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const dateSegment = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
        now.getDate()
      )}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(
        now.getSeconds()
      )}`;
      const storagePath = `/lesson-content/${dateSegment}`;

      const response = await uploadFile(file, {
        endpoint: "file/upload",
        fieldName: "file",
        data: { path: storagePath },
        onProgress: (percent) => setUploadProgress(percent),
      });

      console.log("🚀 ~ Upload response:", response);
      if (response?.url) {
        onInsert(response.url);
        onClose();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, onImageInsert);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, onVideoInsert);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, onAudioInsert);
    }
  };

  return (
    <>
      <Dialog open={showImageDialog} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleImageSubmit()}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleImageSubmit} disabled={!imageUrl.trim()}>
                  Insert
                </Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <input
                  ref={imageFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => imageFileRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image File
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoDialog} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Video</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  placeholder="https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVideoSubmit()}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleVideoSubmit} disabled={!videoUrl.trim()}>
                  Insert
                </Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <div>
                <Label>Upload Video</Label>
                <input
                  ref={videoFileRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => videoFileRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video File
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showAudioDialog} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Audio</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">
                <LinkIcon className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <div>
                <Label htmlFor="audio-url">Audio URL</Label>
                <Input
                  id="audio-url"
                  placeholder="https://example.com/audio.mp3"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAudioSubmit()}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleAudioSubmit} disabled={!audioUrl.trim()}>
                  Insert
                </Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4">
              <div>
                <Label>Upload Audio</Label>
                <input
                  ref={audioFileRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => audioFileRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Audio File
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
