import { Navigation } from "@/components/Navigation";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/tools";

const AllTools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">All Tools</h1>
          <p className="text-muted-foreground mb-12">
            Browse our complete collection of free online tools
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTools;
