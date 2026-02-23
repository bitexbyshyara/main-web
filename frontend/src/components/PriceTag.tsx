interface PriceTagProps {
  amount: number;
  period?: string;
}

const PriceTag = ({ amount, period = "/mo" }: PriceTagProps) => (
  <div className="flex items-baseline gap-1">
    <span className="text-sm text-muted-foreground">₹</span>
    <span className="text-4xl font-heading font-bold text-foreground">{amount.toLocaleString("en-IN")}</span>
    <span className="text-sm text-muted-foreground">{period}</span>
  </div>
);

export default PriceTag;
