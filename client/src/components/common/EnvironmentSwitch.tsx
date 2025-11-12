// components/ui/EnvironmentSwitch.tsx
import React from "react";

interface EnvironmentSwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const EnvironmentSwitch: React.FC<EnvironmentSwitchProps> = ({
  label = "Production",
  checked = false,
  onChange,
}) => {
  return (
    <div
      className="
        flex items-center rounded-md py-2 px-3
        bg-gradient-to-r from-primary/70 to-primary/30
        dark:from-primary/50 dark:to-primary/20
        text-primary-foreground
        shadow-lg shadow-primary/25
        scale-[1.02] transition-all
      "
    >
      {/* Label */}
      <div className="text-sm font-medium w-20">{label}</div>

      {/* Switch */}
      <label className="relative inline-flex items-center cursor-pointer ml-2">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div className="
          w-11 h-6
          bg-gray-300 dark:bg-gray-600
          rounded-full
          peer-checked:bg-primary
          relative
          transition-colors
          after:content-['']
          after:absolute
          after:top-0.5
          after:left-[2px]
          after:w-5 after:h-5
          after:bg-white
          after:rounded-full
          after:border after:border-gray-300 dark:after:border-gray-600
          after:transition-all
          peer-checked:after:translate-x-full
        "></div>
      </label>
    </div>
  );
};

export default EnvironmentSwitch;