// tslint:disable:no-any
import Avatar from "antd/lib/avatar";
import Table from "antd/lib/table";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import {
  consensusIcon,
  renderDelegateName,
  renderLiveVotes,
  renderProductivity
} from "./bp-render";
import { TBpCandidate } from "./types";

// @ts-ignore
import withStyles, { WithStyles } from "react-jss";

export type CustomTBpCandidate = TBpCandidate & { custom: boolean };

export type RenderDelegateComponent = (
  delegate?: CustomTBpCandidate
) => JSX.Element;

type Props = {
  dataSource: Array<CustomTBpCandidate>;
  extraComponents?: Array<RenderDelegateComponent>;
};

// @ts-ignore
const Title = ({ children, ...others }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "77px",
        backgroundColor: "#f6f8fa",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        ...others
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

const styles = {
  tableContent: {
    "& .ant-table-thead > tr > th": {
      padding: "16px 10px !important"
    }
  }
};

interface IProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  classes: any;
}

// @ts-ignore
const Div: React.FunctionComponent<IProps> = ({ classes, children }) => (
  <div className={classes.tableContent}>{children}</div>
);

const TableContent = withStyles(styles)(Div);

export class BlockProducersList extends Component<Props> {
  public render(): JSX.Element {
    const { dataSource, extraComponents } = this.props;
    const components = extraComponents || [];
    const columns = [
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
      },
      {
        title: t("candidate.productivity"),
        dataIndex: "productivity",
        render: renderProductivity
      }
    ];

    return (
      <div className="mobile-delegate-list">
        {dataSource.map((delegate, index) => {
          const rate = delegate.category === "CONSENSUS_DELEGATE" ? 1 : 0;
          const justifyContent = components.length > 0 ? "space-between" : "";
          const sizes = components.length > 0 ? { width: "40%" } : {};

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
              <Title justifyContent={justifyContent}>
                {consensusIcon(delegate.rank, rate, 43, 57, "")}
                <div style={{ margin: "0 14px", ...sizes }}>
                  {renderDelegateName(delegate.name, delegate)}
                </div>
                {components.map((renderComponent, index) => {
                  return <div key={index}>{renderComponent(delegate)}</div>;
                })}
              </Title>
              <TableContent>
                <Table
                  dataSource={[delegate]}
                  columns={columns}
                  rowKey={"id"}
                  pagination={false}
                />
              </TableContent>
            </Item>
          );
        })}
      </div>
    );
  }
}
