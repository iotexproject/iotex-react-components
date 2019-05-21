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
import { TBpCandidate } from "./types";

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

const linearGradient = (opacity: number, endOpacity: number) =>
  `linear-gradient(to right, rgba(3,179,178,${opacity}), rgba(27,221,164,${endOpacity}))`;

export function consensusIcon(
  text: string,
  rate: number,
  width: number,
  height: number,
  margin: string
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
          backgroundImage: linearGradient(fullOpacity, fullOpacity),
          width: "2px",
          height: "100%"
        }}
      />
      <div
        style={{
          backgroundImage: linearGradient(halfOpacity, halfOpacity),
          width: "1px",
          height: "100%",
          marginLeft: "1px"
        }}
      />
      <div
        style={{
          backgroundImage: linearGradient(lessOpacity, 0),
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

export function renderRank(text: string, record: TBpCandidate): JSX.Element {
  const rate = record.category === "CONSENSUS_DELEGATE" ? 1 : 0;
  return consensusIcon(text, rate, 43, 57, "-10px -16px");
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
          marginLeft: "10px",
          color: colors.text02,
          fontSize: "24px"
        }}
      >
        {t("candidates.delegate_list")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection,
          fontSize: "12px",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginRight
          }}
        >
          {consensusIcon("", 1, 14, 10, "0")}
          <span style={{ marginLeft: "9px" }}>
            {t("candidates.election.consensus_delegates")}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginRight
          }}
        >
          <Circle color={colors.ONLINE} />
          <span style={{ marginLeft: "9px" }}>
            {t(`candidates.election.ONLINE`)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginRight
          }}
        >
          <Circle color={colors.OFFLINE} />
          <span style={{ marginLeft: "9px" }}>
            {t(`candidates.election.OFFLINE`)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginRight
          }}
        >
          <Circle color={colors.NOT_EQUIPPED} />
          <span style={{ marginLeft: "9px" }}>
            {t(`candidates.election.NOT_EQUIPPED`)}
          </span>
        </div>
      </div>
    </div>
  );
}
