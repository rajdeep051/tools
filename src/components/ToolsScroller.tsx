import { FileType, Volume2, Crop, Sliders } from "lucide-react";

const tools = [
  { name: "File Converter", icon: FileType },
  { name: "Audio Remover", icon: Volume2 },
  { name: "Image Cropper", icon: Crop },
  { name: "Video Adjuster", icon: Sliders },
];

export const ToolsScroller = () => {
  return (
    <div className="relative overflow-hidden bg-secondary/50 py-8 border-y border-border">
      <div className="flex animate-scroll">
        {[...tools, ...tools].map((tool, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-8 whitespace-nowrap"
          >
            <tool.icon className="h-6 w-6 text-primary" />
            <span className="text-lg font-medium">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
