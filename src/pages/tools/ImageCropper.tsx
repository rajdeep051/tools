import { Navigation } from "@/components/Navigation";
import { AdSection } from "@/components/AdSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getCroppedImg = async (imageSrc: string, pixelCrop: CropArea): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/png");
};

const ImageCropper = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 300, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<string>("free");
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setImageNaturalSize({ width: img.width, height: img.height });
          // Initialize crop area to center of image
          const initialWidth = Math.min(300, img.width * 0.6);
          const initialHeight = Math.min(300, img.height * 0.6);
          setCropArea({
            x: (img.width - initialWidth) / 2,
            y: (img.height - initialHeight) / 2,
            width: initialWidth,
            height: initialHeight,
          });
        };
        img.src = reader.result as string;
        setImageSrc(reader.result as string);
        setCroppedImage("");
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCrop = useCallback(async () => {
    if (!imageSrc) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const croppedImg = await getCroppedImg(imageSrc, cropArea);
      setCroppedImage(croppedImg);
      toast.success("Image cropped successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  }, [imageSrc, cropArea]);

  const handleDownload = () => {
    if (!croppedImage) {
      toast.error("Please crop the image first");
      return;
    }

    const link = document.createElement("a");
    link.download = `cropped-${file?.name || "image.png"}`;
    link.href = croppedImage;
    link.click();
    toast.success("Image downloaded!");
  };

  const handleAspectRatioChange = (value: string) => {
    setAspectRatio(value);
    if (value !== "free") {
      const ratio = parseFloat(value);
      setCropArea(prev => ({
        ...prev,
        height: prev.width / ratio,
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent, handle?: string) => {
    e.preventDefault();
    if (handle) {
      setIsResizing(handle);
    } else {
      setIsDragging(true);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = imageNaturalSize.width / rect.width;
      const scaleY = imageNaturalSize.height / rect.height;

      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) * scaleX;
        const deltaY = (e.clientY - dragStart.y) * scaleY;
        
        setCropArea(prev => ({
          ...prev,
          x: Math.max(0, Math.min(imageNaturalSize.width - prev.width, prev.x + deltaX)),
          y: Math.max(0, Math.min(imageNaturalSize.height - prev.height, prev.y + deltaY)),
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing) {
        const deltaX = (e.clientX - dragStart.x) * scaleX;
        const deltaY = (e.clientY - dragStart.y) * scaleY;
        
        setCropArea(prev => {
          let newArea = { ...prev };
          const ratio = aspectRatio !== "free" ? parseFloat(aspectRatio) : null;

          // Side handles - opposite side stays fixed
          if (isResizing === "e") {
            // Right side: left edge (x) is anchor, only width changes
            const maxWidth = imageNaturalSize.width - prev.x;
            newArea.width = Math.max(50, Math.min(maxWidth, prev.width + deltaX));
            // x stays at prev.x (already set)
          } else if (isResizing === "w") {
            // Left side: right edge (x + width) is anchor
            const rightEdge = prev.x + prev.width;
            const desiredX = prev.x + deltaX;
            
            // Clamp x to stay within bounds
            const clampedX = Math.max(0, desiredX);
            const maxWidth = rightEdge - clampedX;
            newArea.width = Math.max(50, Math.min(maxWidth, rightEdge - clampedX));
            newArea.x = rightEdge - newArea.width;
          } else if (isResizing === "s") {
            // Bottom side: top edge (y) is anchor, only height changes
            const maxHeight = imageNaturalSize.height - prev.y;
            newArea.height = Math.max(50, Math.min(maxHeight, prev.height + deltaY));
            // y stays at prev.y (already set)
          } else if (isResizing === "n") {
            // Top side: bottom edge (y + height) is anchor
            const bottomEdge = prev.y + prev.height;
            const desiredY = prev.y + deltaY;
            
            // Clamp y to stay within bounds
            const clampedY = Math.max(0, desiredY);
            const maxHeight = bottomEdge - clampedY;
            newArea.height = Math.max(50, Math.min(maxHeight, bottomEdge - clampedY));
            newArea.y = bottomEdge - newArea.height;
          }
          // Corner handles - opposite corner stays fixed
          else if (isResizing === "se") {
            // Bottom-right: top-left corner (x, y) is anchor
            const maxWidth = imageNaturalSize.width - prev.x;
            const maxHeight = imageNaturalSize.height - prev.y;
            newArea.width = Math.max(50, Math.min(maxWidth, prev.width + deltaX));
            newArea.height = Math.max(50, Math.min(maxHeight, prev.height + deltaY));
            // x and y stay at prev values (already set)
          } else if (isResizing === "sw") {
            // Bottom-left: top-right corner is anchor
            const rightEdge = prev.x + prev.width;
            const desiredX = prev.x + deltaX;
            
            // Clamp x and width
            const clampedX = Math.max(0, desiredX);
            const maxWidth = rightEdge - clampedX;
            newArea.width = Math.max(50, Math.min(maxWidth, rightEdge - clampedX));
            newArea.x = rightEdge - newArea.width;
            
            // Height uses y anchor
            const maxHeight = imageNaturalSize.height - prev.y;
            newArea.height = Math.max(50, Math.min(maxHeight, prev.height + deltaY));
          } else if (isResizing === "ne") {
            // Top-right: bottom-left corner is anchor
            const bottomEdge = prev.y + prev.height;
            const desiredY = prev.y + deltaY;
            
            // Width uses x anchor
            const maxWidth = imageNaturalSize.width - prev.x;
            newArea.width = Math.max(50, Math.min(maxWidth, prev.width + deltaX));
            
            // Clamp y and height
            const clampedY = Math.max(0, desiredY);
            const maxHeight = bottomEdge - clampedY;
            newArea.height = Math.max(50, Math.min(maxHeight, bottomEdge - clampedY));
            newArea.y = bottomEdge - newArea.height;
          } else if (isResizing === "nw") {
            // Top-left: bottom-right corner is anchor
            const rightEdge = prev.x + prev.width;
            const bottomEdge = prev.y + prev.height;
            const desiredX = prev.x + deltaX;
            const desiredY = prev.y + deltaY;
            
            // Clamp x and width
            const clampedX = Math.max(0, desiredX);
            const maxWidth = rightEdge - clampedX;
            newArea.width = Math.max(50, Math.min(maxWidth, rightEdge - clampedX));
            newArea.x = rightEdge - newArea.width;
            
            // Clamp y and height
            const clampedY = Math.max(0, desiredY);
            const maxHeight = bottomEdge - clampedY;
            newArea.height = Math.max(50, Math.min(maxHeight, bottomEdge - clampedY));
            newArea.y = bottomEdge - newArea.height;
          }

          // Maintain aspect ratio if set (while respecting anchors)
          if (ratio) {
            if (isResizing === "se") {
              // Adjust height based on width, x and y are anchors
              const maxHeight = imageNaturalSize.height - newArea.y;
              newArea.height = Math.min(newArea.width / ratio, maxHeight);
            } else if (isResizing === "sw") {
              // Adjust height based on width, right edge and y are anchors
              const rightEdge = prev.x + prev.width;
              const maxHeight = imageNaturalSize.height - newArea.y;
              newArea.height = Math.min(newArea.width / ratio, maxHeight);
              newArea.x = rightEdge - newArea.width;
            } else if (isResizing === "ne") {
              // Adjust width based on height, x and bottom edge are anchors
              const bottomEdge = prev.y + prev.height;
              const maxWidth = imageNaturalSize.width - newArea.x;
              newArea.width = Math.min(newArea.height * ratio, maxWidth);
              newArea.y = bottomEdge - newArea.height;
            } else if (isResizing === "nw") {
              // Adjust both to maintain ratio, bottom-right corner is anchor
              const rightEdge = prev.x + prev.width;
              const bottomEdge = prev.y + prev.height;
              newArea.height = newArea.width / ratio;
              newArea.x = rightEdge - newArea.width;
              newArea.y = bottomEdge - newArea.height;
            } else if (isResizing === "e" || isResizing === "w") {
              // Horizontal resize: adjust height maintaining anchor
              if (isResizing === "e") {
                // x is anchor
                const maxHeight = imageNaturalSize.height - newArea.y;
                newArea.height = Math.min(newArea.width / ratio, maxHeight);
              } else {
                // Right edge is anchor
                const rightEdge = prev.x + prev.width;
                newArea.height = newArea.width / ratio;
                newArea.x = rightEdge - newArea.width;
              }
            } else if (isResizing === "n" || isResizing === "s") {
              // Vertical resize: adjust width maintaining anchor
              if (isResizing === "s") {
                // y is anchor
                const maxWidth = imageNaturalSize.width - newArea.x;
                newArea.width = Math.min(newArea.height * ratio, maxWidth);
              } else {
                // Bottom edge is anchor
                const bottomEdge = prev.y + prev.height;
                newArea.width = newArea.height * ratio;
                newArea.y = bottomEdge - newArea.height;
              }
            }
          }

          return newArea;
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, imageNaturalSize, aspectRatio]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {!imageSrc ? (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-3">Image Cropper</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Crop and resize your images with precision - all in your browser
            </p>
            <div className="border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors p-12">
              <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Upload Your Image</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Drag and drop or click to select
              </p>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button size="lg" onClick={() => document.getElementById("image")?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          </div>
        </div>
      ) : !croppedImage ? (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-80 bg-muted/30 border-r border-border p-6 space-y-6 overflow-y-auto flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold mb-4">Crop Rectangle</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm mb-2 block">Width</Label>
                    <Input
                      type="number"
                      value={Math.round(cropArea.width)}
                      onChange={(e) => {
                        const width = Number(e.target.value);
                        setCropArea(prev => ({
                          ...prev,
                          width: Math.max(50, Math.min(imageNaturalSize.width - prev.x, width)),
                          height: aspectRatio !== "free" ? width / parseFloat(aspectRatio) : prev.height,
                        }));
                      }}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block">Height</Label>
                    <Input
                      type="number"
                      value={Math.round(cropArea.height)}
                      onChange={(e) => {
                        const height = Number(e.target.value);
                        setCropArea(prev => ({
                          ...prev,
                          height: Math.max(50, Math.min(imageNaturalSize.height - prev.y, height)),
                          width: aspectRatio !== "free" ? height * parseFloat(aspectRatio) : prev.width,
                        }));
                      }}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Aspect Ratio</Label>
                  <Select value={aspectRatio} onValueChange={handleAspectRatioChange}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">FreeForm</SelectItem>
                      <SelectItem value="1">1:1 (Square)</SelectItem>
                      <SelectItem value="0.8">4:5</SelectItem>
                      <SelectItem value="1.5">3:2</SelectItem>
                      <SelectItem value="1.7778">16:9</SelectItem>
                      <SelectItem value="0.5625">9:16</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Crop Position</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-2 block">Position (Y)</Label>
                  <Input
                    type="number"
                    value={Math.round(cropArea.y)}
                    onChange={(e) => {
                      const y = Number(e.target.value);
                      setCropArea(prev => ({
                        ...prev,
                        y: Math.max(0, Math.min(imageNaturalSize.height - prev.height, y)),
                      }));
                    }}
                    className="bg-background"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Position (X)</Label>
                  <Input
                    type="number"
                    value={Math.round(cropArea.x)}
                    onChange={(e) => {
                      const x = Number(e.target.value);
                      setCropArea(prev => ({
                        ...prev,
                        x: Math.max(0, Math.min(imageNaturalSize.width - prev.width, x)),
                      }));
                    }}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCrop} 
              size="lg" 
              className="w-full gap-2"
            >
              Crop →
            </Button>

            <Button 
              onClick={() => {
                setImageSrc("");
                setFile(null);
                setCroppedImage("");
              }} 
              variant="outline"
              className="w-full"
            >
              Reset
            </Button>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 overflow-auto bg-muted/10 p-8 flex flex-col items-center">
            {/* Top Ad */}
            <div className="w-full max-w-4xl mb-4">
              <AdSection slot="image-cropper-top" />
            </div>

            <div 
              ref={canvasRef}
              className="relative mx-auto max-w-full"
              style={{ 
                width: 'fit-content',
                maxWidth: '100%'
              }}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-w-full h-auto block"
                draggable={false}
              />
              
              {/* Crop Overlay */}
              {imageRef.current && canvasRef.current && (
                <div
                  className="absolute border-2 border-white cursor-move"
                  style={{
                    left: `${(cropArea.x / imageNaturalSize.width) * 100}%`,
                    top: `${(cropArea.y / imageNaturalSize.height) * 100}%`,
                    width: `${(cropArea.width / imageNaturalSize.width) * 100}%`,
                    height: `${(cropArea.height / imageNaturalSize.height) * 100}%`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                  }}
                  onMouseDown={(e) => handleMouseDown(e)}
                >
                  {/* Corner Handles */}
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -top-2 -left-2 cursor-nw-resize"
                    onMouseDown={(e) => handleMouseDown(e, "nw")}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -top-2 -right-2 cursor-ne-resize"
                    onMouseDown={(e) => handleMouseDown(e, "ne")}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -bottom-2 -left-2 cursor-sw-resize"
                    onMouseDown={(e) => handleMouseDown(e, "sw")}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -bottom-2 -right-2 cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown(e, "se")}
                  />
                  
                  {/* Edge Handles */}
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -top-2 left-1/2 -translate-x-1/2 cursor-n-resize"
                    onMouseDown={(e) => handleMouseDown(e, "n")}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -bottom-2 left-1/2 -translate-x-1/2 cursor-s-resize"
                    onMouseDown={(e) => handleMouseDown(e, "s")}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -left-2 top-1/2 -translate-y-1/2 cursor-w-resize"
                    onMouseDown={(e) => handleMouseDown(e, "w")}
                  />
                  <div 
                    className="absolute w-4 h-4 bg-white rounded-full border-2 border-background -right-2 top-1/2 -translate-y-1/2 cursor-e-resize"
                    onMouseDown={(e) => handleMouseDown(e, "e")}
                  />
                </div>
              )}
            </div>

            {/* Bottom Ad */}
            <div className="w-full max-w-4xl mt-4">
              <AdSection slot="image-cropper-bottom" />
            </div>

            {/* Ad Banner Below Preview */}
            <div className="w-full max-w-2xl mt-8">
              <AdSection slot="image-cropper-below-preview" className="bg-muted/20" />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Cropped Result</h2>
              <p className="text-muted-foreground">Preview your cropped image below</p>
            </div>
            
            <div className="border-2 border-border rounded-lg p-8 bg-muted/30">
              <img src={croppedImage} alt="Cropped result" className="max-w-full h-auto rounded mx-auto shadow-lg" />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleDownload} size="lg" className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download Image
              </Button>
              <Button onClick={() => setCroppedImage("")} variant="outline" size="lg" className="flex-1">
                Crop Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
