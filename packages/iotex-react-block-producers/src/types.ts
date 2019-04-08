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

export type TBpCandidate = TNewBpCandidate & {
  rank: string;
  registeredName: string;
  liveVotes: string;
  liveVotesDelta: string;
  status: "ELECTED" | "NOT_ELECTED" | "UNQUALIFIED";
  serverStatus: "ONLINE" | "OFFLINE" | "NOT_EQUPPIED";
  percent: string;

  createAt: string;
  updateAt: string;
};
