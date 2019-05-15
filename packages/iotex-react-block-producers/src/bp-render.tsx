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
import { Circle } from "./circle";
import { colors } from "./style-color";
import { TBpCandidate } from "./types";

export const ASSET_URL = "https://member.iotex.io";
export function renderDelegateName(
  text: string,
  record: TBpCandidate
): JSX.Element {
  return (
    <a href={`/delegate/${record.id}`} style={{ display: "flex" }}>
      <div style={{ marginTop: "3px" }}>
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
        {/* Todo change to name for voting */}
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
      {
        <span style={{ padding: "0.5em" }}>
          {Math.abs(text).toLocaleString()}
        </span>
      }
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
        height: `${height}pt`,
        width: `${width}pt`,
        margin
      }}
    >
      <div
        style={{
          backgroundImage: linearGradient(fullOpacity, fullOpacity),
          width: "2pt",
          height: "100%"
        }}
      />
      <div
        style={{
          backgroundImage: linearGradient(halfOpacity, halfOpacity),
          width: "1pt",
          height: "100%",
          marginLeft: "1pt"
        }}
      />
      <div
        style={{
          backgroundImage: linearGradient(lessOpacity, 0),
          width: "calc(100% - 4pt)",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "4pt"
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

export function TableAppendix(): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        paddingLeft: "10pt",
        paddingBottom: "10pt",
        justifyContent: "space-between"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginLeft: "10pt",
          color: colors.text02,
          fontSize: "24pt"
        }}
      >
        {t("candidates.delegate_list")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          fontSize: "12pt"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "25pt"
          }}
        >
          {consensusIcon("", 1, 14, 10, "0")}
          <span style={{ marginLeft: "9pt" }}>
            {t("candidates.election.consensus_delegates")}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "25pt"
          }}
        >
          <Circle color={colors.ONLINE} />
          <span style={{ marginLeft: "9pt" }}>
            {t(`candidates.election.ONLINE`)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "25pt"
          }}
        >
          <Circle color={colors.OFFLINE} />
          <span style={{ marginLeft: "9pt" }}>
            {t(`candidates.election.OFFLINE`)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: "25pt"
          }}
        >
          <Circle color={colors.NOT_EQUIPPED} />
          <span style={{ marginLeft: "9pt" }}>
            {t(`candidates.election.NOT_EQUIPPED`)}
          </span>
        </div>
      </div>
    </div>
  );
}
