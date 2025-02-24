import "react-day-picker";

declare module "react-day-picker" {
  interface CustomComponents {
    IconLeft?: React.ComponentType<{ className?: string }>;
    IconRight?: React.ComponentType<{ className?: string }>;
  }
}