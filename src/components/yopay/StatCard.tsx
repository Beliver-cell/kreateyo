interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export const StatCard = ({ title, value, subtitle, trend = 'neutral' }: StatCardProps) => {
  const trendColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className={`text-2xl font-bold ${trendColors[trend]} mb-1`}>
        {value}
      </div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
};
