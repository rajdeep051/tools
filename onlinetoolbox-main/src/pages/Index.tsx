import { Navigation } from "@/components/Navigation";
import { ToolsScroller } from "@/components/ToolsScroller";
import { ToolCard } from "@/components/ToolCard";
import { AdSection } from "@/components/AdSection";
import { tools } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Online Toolkit
          </h1>
          <p className="text-xl text-muted-foreground mb-8 font-bold">
            Professional-grade tools for file conversion, video editing, and image processing. All free, all in your browser.
          </p>
          <Link to="/all-tools">
            <Button size="lg" className="gap-2">
              Explore All Tools
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Tools Scroller */}
      <ToolsScroller />

      {/* AdSense Section */}
      <section className="container mx-auto px-4 py-8">
        <AdSection slot="homepage-banner" />
      </section>

      {/* Featured Tools */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map(tool => <ToolCard key={tool.id} title={tool.title} description={tool.description} icon={tool.icon} path={tool.path} />)}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 ToolBox. All tools are free to use.</p>
        </div>
      </footer>
    </div>;
};
export default Index;