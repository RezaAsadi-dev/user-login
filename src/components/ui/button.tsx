import type React from "react";
import { forwardRef } from "react";
import styles from "./button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          ${styles.button} 
          ${styles[variant]} 
          ${styles[size]} 
          ${fullWidth ? styles.fullWidth : ""}
          ${loading ? styles.loading : ""}
          ${className || ""}
        `}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className={styles.spinner} />}
        <span className={loading ? styles.hiddenText : ""}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
