import { ExlamationIcon } from "@components/Icons";

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="absolute inset-0 z-30 flex h-full w-full flex-col items-center justify-center bg-red-900/60">
      <ExlamationIcon width={48} className="mb-3 text-red-600" />
      <span className="text-lg text-red-200">{message}</span>
    </div>
  );
};

export default ErrorMessage;
