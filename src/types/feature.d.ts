import { INITIAL_FEATURE_STATE } from "@/const/features";

export type FeatureKey = keyof typeof INITIAL_FEATURE_STATE;
export type TFeatures = Record<FeatureKey, boolean | string | number>;
