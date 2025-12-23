"use client";
import { INITIAL_FEATURE_STATE } from "@/const/features";
import { create } from "zustand";
import toast from "react-hot-toast";
import { TFeatures } from "@/types/feature";

export type TFeature = TFeatures;

type TFeatureState = {
  // feature general
  feature: TFeature;
  IsFeatureReady: boolean;
  NetworkStatus: "disconnected" | "connected" | "reconnect";
  SetNetworkStatus: (val: TFeatureState["NetworkStatus"]) => void;
  SetFeatureReady: (bool: boolean) => void;
  OnUpdateFeature: (
    key: keyof TFeature,
    value?: string | number | boolean
  ) => Record<keyof TFeature, string | number | boolean> | null;
  setFeature: (newFeature: TFeature) => void;
};

export const useFeatureManagerStore = create<TFeatureState>()((set) => ({
  // feature general
  feature: INITIAL_FEATURE_STATE,
  NetworkStatus: "disconnected",
  SetNetworkStatus: (val) => set(() => ({ NetworkStatus: val })),
  IsFeatureReady: true,
  SetFeatureReady: (bool) => set(() => ({ IsFeatureReady: bool })),
  OnUpdateFeature: (key, value) => {
    let data = null;
    set((state) => {
      const prevValue = state.feature[key];
      if (typeof prevValue === "boolean" && value === undefined) {
        data = { [key]: !prevValue };
        return { feature: { ...state.feature, [key]: !prevValue } };
      } else if (value !== undefined) {
        data = { [key]: value };
        return { feature: { ...state.feature, [key]: value } };
      }
      return {};
    });
    return data;
  },
  setFeature: (newFeature) =>
    set((state) => ({
      feature: { ...state.feature, ...newFeature }, // immutable
    })),
}));

export const useFeatureManager = () => {
  const {
    feature,
    OnUpdateFeature: updateFeature,
    setFeature,
    IsFeatureReady,
    SetFeatureReady,
    NetworkStatus,
    SetNetworkStatus,
  } = useFeatureManagerStore();

  const OnUpdateFeature = async (key: keyof TFeature, value?: string | number | boolean) => {
    const data = updateFeature(key, value);
    try {
      if (!data) return toast.error("Invalid update feature");
    } catch (error) {
      console.log(error);
      toast.error(`Failed to update setting`);
    }
  };

  return {
    OnUpdateFeature,
    feature,
    setFeature,
    IsFeatureReady,
    SetFeatureReady,
    NetworkStatus,
    SetNetworkStatus,
  };
};
