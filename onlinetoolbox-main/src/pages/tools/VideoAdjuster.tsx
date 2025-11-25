import { Navigation } from "@/components/Navigation";
import { AdSection } from "@/components/AdSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Upload, Download, Sliders } from "lucide-react";
import { toast } from "sonner";

const VideoAdjuster = () => {
  const [file, setFile] = useState<File | null>(null);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [brightness, setBrightness] = useState([100]);
  const [hue, setHue] = useState([0]);

  const handleAdjust = () => {
    if (!file) {
      toast.error("Please select a video file");
      return;
    }
    toast.success("Video adjustment started! This is a demo - full functionality coming soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Video Adjuster</h1>
          <p className="text-muted-foreground mb-8">
            Adjust video settings like contrast, saturation, hue, and more
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Adjust Your Video</CardTitle>
              <CardDescription>Upload a video and adjust its visual properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="video">Select Video File</Label>
                <div className="flex gap-2">
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Contrast</Label>
                    <span className="text-sm text-muted-foreground">{contrast[0]}%</span>
                  </div>
                  <Slider value={contrast} onValueChange={setContrast} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Saturation</Label>
                    <span className="text-sm text-muted-foreground">{saturation[0]}%</span>
                  </div>
                  <Slider value={saturation} onValueChange={setSaturation} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Brightness</Label>
                    <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
                  </div>
                  <Slider value={brightness} onValueChange={setBrightness} max={200} step={1} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Hue</Label>
                    <span className="text-sm text-muted-foreground">{hue[0]}°</span>
                  </div>
                  <Slider value={hue} onValueChange={setHue} max={360} step={1} />
                </div>
              </div>

              <Button onClick={handleAdjust} className="w-full gap-2" disabled={!file}>
                <Sliders className="h-4 w-4" />
                Apply Adjustments & Download
              </Button>
            </CardContent>
          </Card>

          <AdSection slot="video-adjuster-result" />
        </div>
      </div>
    </div>
  );
};

export default VideoAdjuster;
