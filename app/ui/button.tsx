import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType: string;
}

export function Button({
  buttonType,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <>
      {buttonType === "default" && (
        <button
          {...rest}
          className={clsx(
            "flex items-center px-4 py-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:opacity-95 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800 active:bg-indigo-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
            className
          )}
        >
          {children}
        </button>
      )}
      {buttonType === "confirm" && (
        <button
          {...rest}
          className={clsx(
            "flex items-center px-4 py-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:opacity-95 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800 active:bg-indigo-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
            className
          )}
        >
          {children}
        </button>
      )}
      {buttonType === "error" && (
        <button
          {...rest}
          className={clsx(
            "flex items-center px-4 py-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:opacity-95 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-800 active:bg-indigo-800 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
            className
          )}
        >
          {children}
        </button>
      )}
    </>
  );
}
