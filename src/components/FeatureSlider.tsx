import React from "react";
import { Slider } from "./ui/slider";
import { useDebounce } from "use-debounce";

type TFeatureSlider = {
  defaultValue: number;
  maxValue?: number;
  step?: number;
  disabled?: boolean;
  onValueChange: (e: number) => void;
};

export const FeatureSlider = ({
  defaultValue = 5,
  maxValue = 10,
  step = 1,
  onValueChange,
  disabled = false,
}: TFeatureSlider) => {
  const [IsMounted, setIsMounted] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [debouncedValue] = useDebounce(value, 1000);

  React.useEffect(() => {
    if (!IsMounted) return;
    onValueChange(debouncedValue);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [debouncedValue]);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative h-6 flex items-center">
      <Slider
        disabled={disabled}
        value={[value]} // controlled oleh state
        max={maxValue}
        step={step}
        onValueChange={(e) => setValue(e[0])}
        className="w-[85%]"
      />
      <p className="absolute top-0 right-0 flex items-center justify-end">{value}</p>
    </div>
  );
};
