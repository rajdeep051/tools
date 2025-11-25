import { Navigation } from "@/components/Navigation";
import { AdSection } from "@/components/AdSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Upload, Download, VolumeX } from "lucide-react";
import { toast } from "sonner";

const AudioRemover = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleRemoveAudio = () => {
    if (!file) {
      toast.error("Please select a video file");
      return;
    }
    toast.success("Audio removal started! This is a demo - full functionality coming soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Audio Remover</h1>
          <p className="text-muted-foreground mb-8">
            Remove audio tracks from video files quickly and easily
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Remove Audio from Video</CardTitle>
              <CardDescription>Upload a video file to remove its audio track</CardDescription>
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

              {file && (
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm font-medium">Selected file:</p>
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                </div>
              )}

              <Button onClick={handleRemoveAudio} className="w-full gap-2">
                <VolumeX className="h-4 w-4" />
                Remove Audio & Download
              </Button>
            </CardContent>
          </Card>

          <AdSection slot="audio-remover-result" />
        </div>
      </div>
    </div>
  );
};

export default AudioRemover;
