import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type T = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

function FeatureSection({ title, children, description }: T) {
  return (
    <Card className="rounded-xl transition outline-1 outline-slate-300/5 w-full">
      <CardHeader>
        <CardTitle className="text-xl 2xl:text-2xl font-semibold">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-sm font-normal text-slate-300/80">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="divide-y divide-gray-800">{children}</CardContent>
    </Card>
  );
}

export default FeatureSection;
