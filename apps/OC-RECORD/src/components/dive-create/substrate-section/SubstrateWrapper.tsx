"use client";

import SubstrateTargetSelector from "./SubstrateTargetSelector";
import SubstrateRange from "./SubstrateRange";
import SubstrateCondition from "./SubstrateCondition";

export default function SubstrateWrapper() {
  return (
    <>
      <SubstrateTargetSelector />
      <SubstrateRange />
      <SubstrateCondition />
    </>
  );
}
