const avatars = ["RP", "AS", "MA", "SK", "PD"];

const TrustedBadge = () => (
  <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
    <div className="flex -space-x-1.5">
      {avatars.map((initials, i) => (
        <div
          key={i}
          className="h-6 w-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-semibold text-foreground"
        >
          {initials}
        </div>
      ))}
    </div>
    <p className="text-sm text-muted-foreground">
      Trusted by <span className="font-semibold text-foreground">500+</span> restaurants
    </p>
  </div>
);

export default TrustedBadge;
