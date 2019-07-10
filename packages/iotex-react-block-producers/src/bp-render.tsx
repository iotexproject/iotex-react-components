// tslint:disable:react-no-dangerous-html
// tslint:disable:no-var-requires
// tslint:disable:no-any
import Avatar from "antd/lib/avatar";
import Icon from "antd/lib/icon";
import Popover from "antd/lib/popover";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { CustomTBpCandidate } from "./block-producers-list";
import { Circle } from "./circle";
import { colors } from "./style-color";
import { DelegateCategory, TBpCandidate } from "./types";

export const ASSET_URL = "https://member.iotex.io";
export function renderDelegateName(
  text: string,
  record: TBpCandidate
): JSX.Element {
  return (
    <a href={`/delegate/${record.id}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Circle color={colors[record.serverStatus]} />
        </div>
        <div
          style={{
            paddingLeft: "1em",
            color: colors.black90,
            fontWeight: "bold",
            lineHeight: 1.36
          }}
        >
          <div>{text}</div>
          <div
            style={{
              fontSize: "12px",
              color: colors.black80,
              fontWeight: "normal",
              paddingTop: "5px"
            }}
          >
            {record.registeredName}
          </div>
        </div>
      </div>
    </a>
  );
}

const JsonGlobal = require("safe-json-globals/get");
const state = isBrowser && JsonGlobal("state");
const ENABLE_DETAILED_STATUS =
  state && state.base && state.base.enableDetailedServerStatus;

// @ts-ignore
export function renderStatus(text: string, record: any): JSX.Element {
  const status = record.status ? record.status : "UNQUALIFIED";
  const serverStatus = record.serverStatus
    ? record.serverStatus
    : "NOT_EQUIPPED";
  return (
    <Popover
      content={
        <p
          dangerouslySetInnerHTML={{ __html: t("candidates.election.explain") }}
        />
      }
      trigger="hover"
    >
      {ENABLE_DETAILED_STATUS ? (
        <div style={{ cursor: "pointer" }}>
          <Avatar
            shape="square"
            size={14}
            src={`${ASSET_URL}/bpStatus/${serverStatus}.png`}
          />
          <span style={{ padding: "0.5em" }}>
            {t(`candidates.election.${serverStatus}`)}
          </span>
        </div>
      ) : (
        <div style={{ cursor: "pointer" }}>
          <Avatar
            shape="square"
            size={14}
            // @ts-ignore
            style={{ backgroundColor: colors[status] }}
          />
          <span style={{ padding: "0.5em" }}>
            {t(`candidates.election.${status}`)}
          </span>
        </div>
      )}
    </Popover>
  );
}

// @ts-ignore
export function renderLiveVotes(text: number, record: any): JSX.Element {
  let iconType = "minus";
  if (record.liveVotesDelta > 0) {
    iconType = "arrow-up";
  } else if (record.liveVotesDelta < 0) {
    iconType = "arrow-down";
  }

  let color = colors.black80;
  if (record.liveVotesDelta > 0) {
    color = colors.deltaUp;
  } else if (record.liveVotesDelta < 0) {
    color = colors.error;
  }

  const enableDelta = false;

  return (
    <div>
      {<span>{Math.abs(text).toLocaleString()}</span>}
      {enableDelta && (
        <Icon
          type={iconType}
          style={{
            color,
            fontSize: "11px"
          }}
        />
      )}
      {enableDelta && (
        <span
          style={{ padding: "0.5em", fontSize: "11px", color: colors.black80 }}
        >
          {Math.abs(record.liveVotesDelta).toLocaleString()}
        </span>
      )}
    </div>
  );
}

export function renderProductivity(
  text: string,
  record: CustomTBpCandidate
): JSX.Element {
  return (
    <div>
      {record.productivityBase ? `${text} / ${record.productivityBase}` : "-"}
    </div>
  );
}

interface LinearGradientColor {
  red: number;
  green: number;
  blue: number;
}

interface LinearGradientPallet<T> {
  green: Array<T>;
  yellow: Array<T>;
}

type PalletType = keyof LinearGradientPallet<LinearGradientColor>;

type LinearGradientDirection = "right" | "left" | "bottom" | "top";

interface LinearGradientConfig {
  type: PalletType;
  direction: LinearGradientDirection;
}

/**
 * @description Linear gradient config.
 * Add additional color below.
 */
const pallet: LinearGradientPallet<LinearGradientColor> = {
  green: [
    { red: 3, green: 179, blue: 178 },
    { red: 27, green: 221, blue: 164 }
  ],
  yellow: [
    { red: 245, green: 167, blue: 30 },
    { red: 255, green: 208, blue: 80 }
  ]
};
const primaryLinearConfig: LinearGradientConfig = {
  type: "green",
  direction: "right"
};
const secondaryLinearConfig: LinearGradientConfig = {
  type: "yellow",
  direction: "right"
};

const colorWithAlpha = (
  { red, green, blue }: LinearGradientColor,
  alpha: number
): string => `rgba(${red},${green},${blue},${alpha})`;

const linearGradient = (
  opacity: number,
  endOpacity: number,
  { type, direction }: LinearGradientConfig
) => {
  const [color, endColor] = pallet[type];
  const start = colorWithAlpha(color, opacity);
  const end = colorWithAlpha(endColor, endOpacity);

  return `linear-gradient(to ${direction}, ${start}, ${end})`;
};

export function consensusIcon(
  text: string,
  rate: number,
  width: number,
  height: number,
  margin: string,
  config: LinearGradientConfig = primaryLinearConfig
): JSX.Element {
  const fullOpacity = rate;
  const halfOpacity = rate * 0.5;
  const lessOpacity = rate * 0.1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: `${height}px`,
        width: `${width}px`,
        margin
      }}
    >
      <div
        style={{
          backgroundImage: linearGradient(fullOpacity, fullOpacity, config),
          width: "2px",
          height: "100%"
        }}
      />
      <div
        style={{
          backgroundImage: linearGradient(halfOpacity, halfOpacity, config),
          width: "1px",
          height: "100%",
          marginLeft: "1px"
        }}
      />
      <div
        style={{
          backgroundImage: linearGradient(lessOpacity, 0, config),
          width: "calc(100% - 4px)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "4px"
        }}
      >
        {text}
      </div>
    </div>
  );
}

/**
 * @description Whether the category needs an identifier
 */
function isNeedCategoryIndicator(category: DelegateCategory): boolean {
  const categories: Array<DelegateCategory> = [
    "CONSENSUS_DELEGATE",
    "DELEGATE"
  ];

  return categories.includes(category);
}

interface RankIndicator {
  rate: number;
  config?: LinearGradientConfig;
}

/**
 * @description
 */
function getCategoryLinearConfig(category: DelegateCategory): RankIndicator {
  const rate = Number(isNeedCategoryIndicator(category));

  switch (category) {
    case "CONSENSUS_DELEGATE":
      return { rate, config: primaryLinearConfig };
    case "DELEGATE":
      return { rate, config: secondaryLinearConfig };
    default:
      return { rate };
  }
}

export function renderRank(
  text: string,
  { category }: TBpCandidate
): JSX.Element {
  const { rate, config } = getCategoryLinearConfig(category);

  return consensusIcon(text, rate, 43, 57, "-10px -16px", config);
}

interface AppendixProps {
  marginRight: string;
  text: string;
}

interface IconAppendixProps extends AppendixProps {
  config?: LinearGradientConfig;
}

const appendixSpanStyle: React.CSSProperties = {
  marginLeft: "9px",
  whiteSpace: "nowrap"
};

function IconAppendix({
  marginRight,
  text,
  config
}: IconAppendixProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight
      }}
    >
      {consensusIcon("", 1, 14, 10, "0", config)}
      <span style={appendixSpanStyle}>{t(text)}</span>
    </div>
  );
}

interface CircleAppendixProps extends AppendixProps {
  color: string;
}

function CircleAppendix({
  marginRight,
  text,
  color
}: CircleAppendixProps): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginRight
      }}
    >
      <Circle color={color} />
      <span style={appendixSpanStyle}>{t(text)}</span>
    </div>
  );
}

export function tableAppendix(isMobile: boolean): JSX.Element {
  const flexDirection = isMobile ? "column" : "row";
  const marginRight = isMobile ? "0" : "25px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection,
        width: "100%",
        paddingBottom: "10px",
        justifyContent: "space-between",
        flexWrap: "wrap"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          color: colors.text02,
          fontSize: "24px"
        }}
      >
        {t("candidates.delegate_list")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          fontSize: "12px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection
          }}
        >
          <IconAppendix
            marginRight={marginRight}
            text="candidates.election.consensus_delegates"
          />

          <IconAppendix
            marginRight={marginRight}
            text="candidates.election.delegates"
            config={secondaryLinearConfig}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginLeft: isMobile ? "9px" : "0",
            justifyContent: "space-between"
          }}
        >
          <CircleAppendix
            marginRight={marginRight}
            text="candidates.election.ONLINE"
            color={colors.ONLINE}
          />

          <CircleAppendix
            marginRight={marginRight}
            text="candidates.election.OFFLINE"
            color={colors.OFFLINE}
          />

          <CircleAppendix
            marginRight={marginRight}
            text="candidates.election.NOT_EQUIPPED"
            color={colors.NOT_EQUIPPED}
          />
        </div>
      </div>
    </div>
  );
}
