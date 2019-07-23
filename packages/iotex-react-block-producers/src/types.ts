export type TNewBpCandidate = {
  id: string;
  name: string;
  blurb: string;
  website: string;
  logo: string;
  bannerUrl: string;
  socialMedia: Array<string>;
  location: string;
  introduction: string;
  team: string;
  techSetup: string;
  communityPlan: string;
  rewardPlan: string;
  shareCardImage: string;
  serverEndpoint: string;
  discordName: string;
  email: string;

  tempEthAddress?: string;
};

export type DelegateCategory =
  | "CONSENSUS_DELEGATE"
  | "DELEGATE"
  | "DELEGATE_CANDIDATE";

export type DelegateStatus = "ELECTED" | "NOT_ELECTED" | "UNQUALIFIED";

export type DelegateServerStatus = "ONLINE" | "OFFLINE" | "NOT_EQUIPPED";

export enum DCategory {
  CONSENSUS_DELEGATE = "CONSENSUS_DELEGATE",
  DELEGATE = "DELEGATE",
  DELEGATE_CANDIDATE = "DELEGATE_CANDIDATE"
}

export enum DStatus {
  ELECTED = "ELECTED",
  NOT_ELECTED = "NOT_ELECTED",
  UNQUALIFIED = "UNQUALIFIED"
}

export enum DServerStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  NOT_EQUIPPED = "NOT_EQUIPPED"
}

export type TBpCandidate = TNewBpCandidate & {
  rank: string;
  registeredName: string;
  liveVotes: string;
  liveVotesDelta: string;
  status: DelegateStatus;
  category: DelegateCategory;
  serverStatus: DelegateServerStatus;
  percent: string;
  productivity: number;
  productivityBase: number;

  createAt: string;
  updateAt: string;
};
