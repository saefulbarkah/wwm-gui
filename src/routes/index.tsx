import { createFileRoute } from "@tanstack/react-router";
import FeatureWrapper from "../components/FeatureWrapper";
import FeatureSection from "@/components/FeatureSection";
import { FeatureCardSwitch } from "@/components/FeatureCard";
import { FeatureSlider } from "@/components/FeatureSlider";
import { CUSTOM_BUFFS } from "@/const/buffs";

export const Route = createFileRoute("/")({
  component: Index,
});

type TFeature = {
  title: string;
  description: string;
  defaultCheck: boolean;
  onSwitch: () => void;
  slider?: {
    defaultValue: number;
    disabled: boolean;
    maxValue: number;
    onValueChange: (e: number) => void;
  };
};

function Index() {
  const MAIN_FEATURES: TFeature[] = [
    {
      title: "World Speed",
      description: "Modify the global movement and animation speed.",
      defaultCheck: false,
      onSwitch: () => console.log("World Speed:"),
      slider: {
        defaultValue: 1,
        disabled: false,
        maxValue: 15,
        onValueChange: (v) => console.log("Speed Value:", v),
      },
    },
    {
      title: "God Mode",
      description: "Player becomes immune to all types of damage.",
      defaultCheck: false,
      onSwitch: () => console.log("God Mode:"),
    },
    {
      title: "Infinite Stamina",
      description: "Stamina will no longer decrease when running or attacking.",
      defaultCheck: false,
      onSwitch: () => console.log("Inf Stamina:"),
    },
    {
      title: "Auto Heal",
      description: "Automatically restores HP when falling below a threshold.",
      defaultCheck: false,
      onSwitch: () => console.log("Auto Heal:"),
    },
    {
      title: "One Hit Kill",
      description: "Eliminate any enemy with a single strike.",
      defaultCheck: false,
      onSwitch: () => console.log("One Hit:"),
    },
    {
      title: "Kill Aura",
      description: "Automatically damages nearby enemies within a radius.",
      defaultCheck: false,
      onSwitch: () => console.log("Kill Aura:"),
    },
    {
      title: "Auto Loot",
      description: "Instantly pick up dropped items from defeated enemies.",
      defaultCheck: false,
      onSwitch: () => console.log("Auto Loot:"),
    },
    {
      title: "Multiply Damage",
      description: "Increase your attack damage by a specific multiplier.",
      defaultCheck: false,
      onSwitch: () => console.log("Mult Damage:"),
      slider: {
        defaultValue: 1,
        disabled: false,
        maxValue: 30,
        onValueChange: (v) => console.log("Dmg Multiplier:", v),
      },
    },
  ];
  return (
    <section>
      <FeatureWrapper>
        <FeatureSection title="Main Features">
          {MAIN_FEATURES.map((item) => (
            <FeatureCardSwitch
              title={item.title}
              description={item.description}
              defaultCheck={item.defaultCheck}
              onSwitch={item.onSwitch}
            >
              {item.slider ? (
                <FeatureSlider
                  defaultValue={item.slider.defaultValue}
                  disabled={item.slider.disabled}
                  maxValue={item.slider.maxValue}
                  onValueChange={item.slider.onValueChange}
                />
              ) : null}
            </FeatureCardSwitch>
          ))}
        </FeatureSection>
        <FeatureSection title="Custom Buffs">
          {CUSTOM_BUFFS.map((item) => (
            <FeatureCardSwitch
              title={item.desc}
              description={item.desc}
              defaultCheck={false}
              onSwitch={() => {
                console.log("SWITCHED");
              }}
            />
          ))}
        </FeatureSection>
      </FeatureWrapper>
    </section>
  );
}
