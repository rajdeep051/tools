import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">About ToolBox</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Your trusted companion for everyday digital tasks
          </p>

          <div className="prose dark:prose-invert max-w-none mb-12">
            <p className="text-lg">
              ToolBox is a collection of free, easy-to-use online tools designed to make your digital life simpler. 
              Whether you need to convert files, edit videos, or process images, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide powerful, professional-grade tools that are accessible to everyone, 
                  completely free of charge.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Fast & Easy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All processing happens in your browser. No uploads, no waiting, 
                  and your files never leave your device.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We take your privacy seriously. Your files are processed locally, 
                  ensuring complete security and confidentiality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
