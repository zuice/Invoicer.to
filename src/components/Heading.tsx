interface Props {
  title: string;
  description: string;
}

export function Heading({ title, description }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
