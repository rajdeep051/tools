import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  className?: string;
}

export const ToolCard = ({ title, description, icon: Icon, path, className }: ToolCardProps) => {
  return (
    <Link to={path} className={className}>
      <Card className="h-full transition-all hover:shadow-[var(--card-hover-shadow)] hover:-translate-y-1 cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
};
