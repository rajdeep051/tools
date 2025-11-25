import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
const navItems = [{
  label: "Home",
  path: "/"
}, {
  label: "All Tools",
  path: "/all-tools"
}, {
  label: "About",
  path: "/about"
}, {
  label: "Contact",
  path: "/contact"
}];
export const Navigation = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const location = useLocation();
  return <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[33vw] min-w-[280px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setSheetOpen(false)} className={cn("flex items-center px-4 py-3 rounded-lg transition-colors text-base", location.pathname === item.path ? "bg-primary text-primary-foreground" : "hover:bg-secondary")}>
                      {item.label}
                    </Link>)}
                  <div className="flex items-center justify-between px-4 py-3 mt-4 border-t border-border pt-4">
                    <span className="text-base">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <Wrench className="h-6 w-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ToolBox
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>;
};