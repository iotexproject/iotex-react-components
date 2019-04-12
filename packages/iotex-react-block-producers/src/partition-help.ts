import partition from "lodash.partition";
import { TBpCandidate } from "./types";

const consensusDelegatesCount = 12;

export function getClassifyDelegate(
  candidatesArray: Array<TBpCandidate>
): Array<TBpCandidate & { custom: boolean }> {
  const bpCandidates = candidatesArray.filter(Boolean);
  const [allDelegates, candidates] = partition(
    bpCandidates,
    (i: TBpCandidate) => i.status === "ELECTED"
  );
  const consensusDelegates = allDelegates.slice(0, consensusDelegatesCount);
  const delegates = allDelegates.slice(consensusDelegatesCount, 100);
  // @ts-ignore
  return [
    {
      id: -1,
      custom: true,
      rank: "ONLINE",
      name: "IoTeX Consensus Delegates"
    },
    ...consensusDelegates,
    {
      id: -2,
      custom: true,
      rank: "LATEST_VERION",
      name: "IoTeX  Delegates"
    },
    ...delegates,
    {
      id: -3,
      custom: true,
      rank: "ONLINE_HALF",
      name: "IoTeX  Delegates Candidates"
    },
    ...candidates
  ];
}
