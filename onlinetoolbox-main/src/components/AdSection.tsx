interface AdSectionProps {
  slot: string;
  className?: string;
}

export const AdSection = ({ slot, className = "" }: AdSectionProps) => {
  return (
    <div className={`bg-muted/30 border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
        AdSense Placeholder - Slot: {slot}
      </div>
    </div>
  );
};
