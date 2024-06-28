import { loadGetInitialProps } from "@/node_modules/next/dist/shared/lib/utils";
import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}
const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
      dark:bg-neutral-900
      dark:outline-none
      outline
      outline-2
      outline-slate-200
      shadow-md
      rounded-lg
      h-fit
      w-full
      bg-opacity-80
      backdrop-blur-lg
      `,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
