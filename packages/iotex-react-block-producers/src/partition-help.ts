// @ts-ignore
import partition from "lodash.partition";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { CustomTBpCandidate } from "./block-producers-list";
import { TBpCandidate } from "./types";

const consensusDelegatesCount = 18;

export function getClassifyDelegate(
  candidatesArray: Array<TBpCandidate>
): Array<CustomTBpCandidate> {
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
      rank: "ELECTED",
      name: t("candidates.election.consensus_delegates")
    },
    ...consensusDelegates,
    {
      id: -2,
      custom: true,
      rank: "LATEST_VERION",
      name: t("candidates.election.delegates")
    },
    ...delegates,
    {
      id: -3,
      custom: true,
      rank: "ONLINE_HALF",
      name: t("candidates.election.delegates_candidates")
    },
    ...candidates
  ];
}
