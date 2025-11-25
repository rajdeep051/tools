import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AllTools from "./pages/AllTools";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FileConverter from "./pages/tools/FileConverter";
import AudioRemover from "./pages/tools/AudioRemover";
import ImageCropper from "./pages/tools/ImageCropper";
import VideoAdjuster from "./pages/tools/VideoAdjuster";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/all-tools" element={<AllTools />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools/file-converter" element={<FileConverter />} />
          <Route path="/tools/audio-remover" element={<AudioRemover />} />
          <Route path="/tools/image-cropper" element={<ImageCropper />} />
          <Route path="/tools/video-adjuster" element={<VideoAdjuster />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
