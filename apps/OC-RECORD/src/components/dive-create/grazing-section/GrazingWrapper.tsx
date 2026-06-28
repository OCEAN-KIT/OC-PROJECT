"use client";

import GrazingTargetSelector from "./GrazingTargetSelector";
import GrazingDensitySelector from "./GrazingDensitySelector";
import GrazingScopeSelector from "./GrazingScopeSelector";
import GrazingCollectedAmount from "./GrazingCollectedAmount";

export default function GrazingWrapper() {
  return (
    <>
      <GrazingTargetSelector />
      <GrazingDensitySelector />
      <GrazingScopeSelector />
      <GrazingCollectedAmount />
    </>
  );
}
