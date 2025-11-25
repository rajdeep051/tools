import { FileType, Volume2, Crop, Sliders, LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export const tools: Tool[] = [
  {
    id: "file-converter",
    title: "File Format Converter",
    description: "Convert between various file formats including documents, images, audio, and video",
    icon: FileType,
    path: "/tools/file-converter",
  },
  {
    id: "audio-remover",
    title: "Audio Remover",
    description: "Remove audio tracks from video files quickly and easily",
    icon: Volume2,
    path: "/tools/audio-remover",
  },
  {
    id: "image-cropper",
    title: "Image Cropper",
    description: "Crop and resize your images with precision",
    icon: Crop,
    path: "/tools/image-cropper",
  },
  {
    id: "video-adjuster",
    title: "Video Adjuster",
    description: "Adjust video settings like contrast, saturation, hue, and more",
    icon: Sliders,
    path: "/tools/video-adjuster",
  },
];
