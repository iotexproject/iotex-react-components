// tslint:disable:no-any
import { Avatar, Table } from "antd";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { renderLiveVotes, renderStatus } from "./bp-render";
import { cloudinaryImage } from "./image";
import { TBpCandidate } from "./types";

export type CustomTBpCandidate = TBpCandidate & { custom: boolean };

export type RenderDelegateComponent = (
  delegate?: CustomTBpCandidate
) => JSX.Element;

type Props = {
  dataSource: Array<CustomTBpCandidate>;
  extraComponents?: Array<RenderDelegateComponent>;
};

// @ts-ignore
const Title = ({ children }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "77px",
        backgroundColor: "#f6f8fa",
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center"
      }}
    >
      {children}
    </div>
  );
};

// @ts-ignore
const Item = ({ children }) => {
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "16px",
        boxShadow: "0px 1px 2px #e3e2e2"
      }}
    >
      {children}
    </div>
  );
};

// @ts-ignore
const Name = ({ children }) => {
  return (
    <span
      style={{
        display: "inline-block",
        fontWeight: "bold",
        fontSize: "16px",
        color: "rgb(12 140 231)",
        marginLeft: "9px",
        lineHeight: "18px"
      }}
    >
      {children}
    </span>
  );
};

// @ts-ignore
const ItemIndex = ({ children }) => {
  return (
    <span
      style={{
        display: "inline-block",
        width: "40px",
        textAlign: "center",
        fontWeight: "bold"
      }}
    >
      {children}
    </span>
  );
};

// @ts-ignore
const IconWrapper = ({ children }) => {
  return (
    <span
      style={{
        display: "inline-block",
        width: "40px",
        textAlign: "center"
      }}
    >
      {children}
    </span>
  );
};

// @ts-ignore
const CategoryTitle = ({ children }) => {
  return (
    <div
      style={{
        height: "54px",
        background: "#dcf5ee",
        lineHeight: "54px",
        borderBottom: "1px solid #e8e8e8"
      }}
    >
      {children}
    </div>
  );
};

export class BlockProducersList extends Component<Props> {
  public render(): JSX.Element {
    const { dataSource, extraComponents } = this.props;
    const components = extraComponents || [];
    const columns = [
      {
        title: t("candidate.status"),
        dataIndex: "serverStatus",
        render: renderStatus
      },
      {
        title: t("candidate.live_votes"),
        dataIndex: "liveVotes",
        key: "liveVotes",
        render: renderLiveVotes
      },
      {
        title: t("candidate.percent"),
        dataIndex: "percent",
        key: "percent",
        render: (text: number) => `${Math.abs(text)}%`
      }
    ];
    return (
      <div className="mobile-delegate-list">
        {dataSource.map((delegate, index) => {
          return delegate.custom ? (
            <CategoryTitle key={index}>
              <IconWrapper>
                <Avatar
                  shape="square"
                  size={14}
                  src={assetURL(
                    `https://member.iotex.io/bpStatus/${delegate.rank}.png`
                  )}
                />
              </IconWrapper>
              <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                {delegate.name}
              </span>
            </CategoryTitle>
          ) : (
            <Item key={index}>
              <Title>
                <div>
                  <ItemIndex>{delegate.rank}</ItemIndex>
                  <a href={`/delegate/${delegate.id}`}>
                    <Avatar
                      shape="square"
                      src={cloudinaryImage(delegate.logo)
                        .changeWidth(35)
                        .cdnUrl()}
                    />
                    <Name>{delegate.name}</Name>
                  </a>
                </div>
                {components.map((renderComponent, index) => {
                  return <div key={index}>{renderComponent(delegate)}</div>;
                })}
              </Title>
              <div>
                <Table
                  dataSource={[delegate]}
                  columns={columns}
                  rowKey={"id"}
                  pagination={false}
                />
              </div>
            </Item>
          );
        })}
      </div>
    );
  }
}
