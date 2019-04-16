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
import { Image } from "./image";
import { colors } from "./style-color";

export const ASSET_URL = "https://member.iotex.io";
export function renderDelegateName(text: string, record: any): JSX.Element {
  return (
    <a href={`/delegate/${record.id}`} style={{ display: "flex" }}>
      <Image
        src={record.logo}
        resizeWidth={32}
        width={"32px"}
        height={"32px"}
      />
      <div
        style={{
          paddingLeft: "1em",
          color: colors.PRODUCING,
          fontWeight: "bold",
          lineHeight: 1.36
        }}
      >
        <div>{text}</div>
        {/* Todo change to name for voting */}
        <div
          style={{
            fontSize: "12px",
            color: "#999",
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

  return (
    <div>
      {
        <span style={{ padding: "0.5em" }}>
          {Math.abs(text).toLocaleString()}
        </span>
      }
      <Icon
        type={iconType}
        style={{
          color,
          fontSize: "11px"
        }}
      />
      <span
        style={{ padding: "0.5em", fontSize: "11px", color: colors.black80 }}
      >
        {Math.abs(record.liveVotesDelta).toLocaleString()}
      </span>
    </div>
  );
}
