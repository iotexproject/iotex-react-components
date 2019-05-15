// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { CustomTBpCandidate } from "./block-producers-list";
import { TBpCandidate } from "./types";

export function getClassifyDelegate(
  candidatesArray: Array<TBpCandidate>,
  addHeaderItem: boolean
): Array<CustomTBpCandidate> {
  const bpCandidates = candidatesArray.filter(Boolean);

  const consensusDelegates = Array<TBpCandidate>();
  const delegates = Array<TBpCandidate>();
  const candidates = Array<TBpCandidate>();

  for (const bp of bpCandidates) {
    if (bp.category === "CONSENSUS_DELEGATE") {
      consensusDelegates.push(bp);
    }
    if (bp.category === "DELEGATE") {
      delegates.push(bp);
    }
    if (bp.category === "DELEGATE_CANDIDATE") {
      candidates.push(bp);
    }
  }

  // @ts-ignore
  if (!addHeaderItem) {
    return [...consensusDelegates, ...delegates, ...candidates];
  }

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
