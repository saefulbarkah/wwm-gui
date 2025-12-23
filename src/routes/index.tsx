import { createFileRoute } from "@tanstack/react-router";
import FeatureWrapper from "../components/FeatureWrapper";
import FeatureSection from "@/components/FeatureSection";
import { FeatureCardSwitch } from "@/components/FeatureCard";
import { FeatureSlider } from "@/components/FeatureSlider";
import { CUSTOM_BUFFS } from "@/const/buffs";
import { useFeatureManager } from "@/hooks/useFeature";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { feature, OnUpdateFeature } = useFeatureManager();

  return (
    <section>
      <FeatureWrapper>
        <FeatureSection title="Main Features">
          <FeatureCardSwitch
            title={"World Speed"}
            description={"Accelerate global movement, animations, and game flow."}
            checked={feature.WorldSpeed as boolean}
            onSwitch={() => OnUpdateFeature("WorldSpeed")}
          >
            <FeatureSlider
              defaultValue={feature.WorldSpeedValue as number}
              disabled={!feature.WorldSpeed}
              maxValue={15}
              onValueChange={(e) => OnUpdateFeature("WorldSpeedValue", e)}
            />
          </FeatureCardSwitch>

          <FeatureCardSwitch
            title={"God Mode"}
            description={"Become invincible. Immune to all incoming damage sources."}
            checked={feature.GodMode as boolean}
            onSwitch={() => OnUpdateFeature("GodMode")}
          />

          <FeatureCardSwitch
            title={"Infinite Stamina"}
            description={"Perform actions like sprinting and dodging without exhaustion."}
            checked={feature.InfiniteStamina as boolean}
            onSwitch={() => OnUpdateFeature("InfiniteStamina")}
          />

          <FeatureCardSwitch
            title={"One Hit Kill"}
            description={"Instantly defeat any enemy with a single attack."}
            checked={feature.OneHitKill as boolean}
            onSwitch={() => OnUpdateFeature("OneHitKill")}
          />

          <FeatureCardSwitch
            title={"Auto Heal"}
            description={"Automatically regenerates health when HP drops below threshold."}
            checked={feature.AutoHeal as boolean}
            onSwitch={() => OnUpdateFeature("AutoHeal")}
          />

          <FeatureCardSwitch
            title={"Kill Aura"}
            description={"Automatically deals damage to enemies within your vicinity."}
            checked={feature.KillAura as boolean}
            onSwitch={() => OnUpdateFeature("KillAura")}
          />

          <FeatureCardSwitch
            title={"Auto Loot"}
            description={"Instantly collect all dropped items and resources automatically."}
            checked={feature.AutoLoot as boolean}
            onSwitch={() => OnUpdateFeature("AutoLoot")}
          />

          <FeatureCardSwitch
            title={"Auto Pick Treasure"}
            description={"Auto pick all trasures."}
            checked={feature.AutoLootTreasure as boolean}
            onSwitch={() => OnUpdateFeature("AutoLootTreasure")}
          />

          <FeatureCardSwitch
            title={"Multiply Damage"}
            description={"Boost your offensive power by a specific multiplier factor."}
            checked={feature.MultiplyDamage as boolean}
            onSwitch={() => OnUpdateFeature("MultiplyDamage")}
          >
            <FeatureSlider
              defaultValue={feature.MultiDamageValue as number}
              disabled={!feature.MultiplyDamage}
              maxValue={30}
              onValueChange={(e) => OnUpdateFeature("MultiDamageValue", e)}
            />
          </FeatureCardSwitch>
        </FeatureSection>

        <FeatureSection title="Custom Buffs">
          {CUSTOM_BUFFS.map((item) => (
            <FeatureCardSwitch
              key={item.key}
              title={item.desc}
              description={`Apply ${item.desc} effect to your character`}
              checked={feature[item.key as keyof typeof feature] as boolean}
              onSwitch={() => OnUpdateFeature(item.key as any)}
            />
          ))}
        </FeatureSection>
      </FeatureWrapper>
    </section>
  );
}
