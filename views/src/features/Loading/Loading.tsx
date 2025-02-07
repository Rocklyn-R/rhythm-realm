
interface LoadingProps {
  size?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = "h-32 w-32"}) => {
  return (
    <div className="flex items-center justify-center mt-10">
      <div className={`animate-spin rounded-full border-t-4 border-red-800 ${size}`}></div>
    </div>
  );
};