import { Navigation } from "@/components/Navigation";
import { AdSection } from "@/components/AdSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { toast } from "sonner";

const convertImage = async (file: File, outputFormat: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        const mimeType = outputFormat === "jpg" ? "image/jpeg" : `image/${outputFormat}`;
        const quality = outputFormat === "jpg" ? 0.9 : 1.0;
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve(url);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

const FileConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("");
  const [convertedUrl, setConvertedUrl] = useState<string>("");
  const [converting, setConverting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Currently only image conversions are supported");
        return;
      }
      setFile(selectedFile);
      setConvertedUrl("");
    }
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) {
      toast.error("Please select a file and output format");
      return;
    }

    setConverting(true);
    try {
      const url = await convertImage(file, outputFormat);
      setConvertedUrl(url);
      toast.success("Conversion complete!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert image");
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl) return;
    
    const link = document.createElement("a");
    const fileName = file?.name.replace(/\.[^/.]+$/, "") || "converted";
    link.download = `${fileName}.${outputFormat}`;
    link.href = convertedUrl;
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Image Format Converter</h1>
          <p className="text-muted-foreground mb-8">
            Convert images between PNG, JPG, and WebP formats - all in your browser
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Convert Your Image</CardTitle>
              <CardDescription>Upload an image and select the output format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Select Image</Label>
                <div className="flex gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={() => document.getElementById("file")?.click()}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleConvert} 
                className="w-full gap-2" 
                disabled={!file || !outputFormat || converting}
              >
                <Download className="h-4 w-4" />
                {converting ? "Converting..." : "Convert Image"}
              </Button>

              {convertedUrl && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <img src={convertedUrl} alt="Converted" className="max-w-full h-auto rounded mx-auto" />
                  </div>
                  <Button onClick={handleDownload} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Converted Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <AdSection slot="file-converter-result" />
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
