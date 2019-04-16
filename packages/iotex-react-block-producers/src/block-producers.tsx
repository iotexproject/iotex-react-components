import Avatar from "antd/lib/avatar";
import notification from "antd/lib/notification";
import Table from "antd/lib/table";
import gql from "graphql-tag";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import { webBpApolloClient } from "./apollo-client";
import { BlockProducersList } from "./block-producers-list";
import { renderDelegateName, renderLiveVotes, renderStatus } from "./bp-render";
import { getClassifyDelegate } from "./partition-help";
import { SpinPreloader } from "./spin-preloader";
import { TBpCandidate } from "./types";

export const PALM_WIDTH = 575;

export const GET_BP_CANDIDATES = gql`
  query bpCandidates {
    bpCandidates {
      rank
      id
      logo
      name
      status
      liveVotes
      liveVotesDelta
      percent
      registeredName
      socialMedia
    }
  }
`;

const renderHook = (render: Function, customRender: Function) => (
  text: string,
  record: TBpCandidate & { custom: boolean },
  index: number
) => {
  if (record.custom) {
    if (customRender) {
      return customRender(text, record, index);
    }
    return {
      rowSpan: 0
    };
  }
  return render(text, record, index);
};

type Props = {
  extraColumns?: Array<object>;
  extraMobileComponents?: Array<Component>;
};

type State = {
  displayMobileList: boolean;
};

export class BlockProducers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileList: false
    };
  }

  public async componentDidMount(): Promise<void> {
    if (
      document.documentElement &&
      document.documentElement.clientWidth <= PALM_WIDTH
    ) {
      this.setState({ displayMobileList: true });
    }
    window.addEventListener("resize", () => {
      if (
        document.documentElement &&
        document.documentElement.clientWidth > PALM_WIDTH
      ) {
        this.setState({ displayMobileList: false });
      } else {
        this.setState({ displayMobileList: true });
      }
    });
  }

  public columns: Array<object>;

  public getColumns(): Array<object> {
    const { extraColumns = [] } = this.props;

    return [
      {
        title: "#",
        key: "index",
        dataIndex: "rank",
        render: (text: number) => text,
        customRender: (text: string) => (
          <Avatar
            shape="square"
            size={14}
            src={assetURL(`https://member.iotex.io/bpStatus/${text}.png`)}
          />
        )
      },
      {
        title: t("candidate.delegate_name"),
        dataIndex: "name",
        key: "name",
        render: renderDelegateName,
        customRender: (text: string) => <b>{text}</b>
      },
      {
        title: t("candidate.status"),
        dataIndex: "status",
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
      },
      ...extraColumns
    ];
  }

  public render(): JSX.Element {
    const { displayMobileList } = this.state;
    const { extraMobileComponents } = this.props;
    const columns = this.getColumns();
    columns.map(i => {
      // @ts-ignore
      i.render = renderHook(i.render, i.customRender);
      return i;
    });

    return (
      <Query client={webBpApolloClient} query={GET_BP_CANDIDATES}>
        {({
          loading,
          error,
          data
        }: QueryResult<{ bpCandidates: Array<TBpCandidate> }>) => {
          if (!loading && error) {
            notification.error({
              message: "Error",
              description: `failed to get block producers: ${error.message}`,
              duration: 3
            });
            return null;
          }

          const dataSource = getClassifyDelegate(
            (data && data.bpCandidates) || []
          );
          const SectionRow = dataSource.reduce(
            // @ts-ignore
            (r, v, i) => r.concat(v.custom ? i : []),
            []
          );

          const renderComponent = displayMobileList ? (
            <BlockProducersList
              dataSource={dataSource}
              extraComponents={extraMobileComponents}
            />
          ) : (
            <Table
              // @ts-ignore
              rowClassName={(record, index) =>
                // @ts-ignore
                SectionRow.includes(index) ? "ant-table-section-row " : ""
              }
              pagination={{ pageSize: 50 }}
              dataSource={dataSource}
              columns={columns}
              scroll={{ x: true }}
              rowKey={"id"}
            />
          );

          return (
            <div
              className={"table-list"}
              style={{ backgroundColor: "transparent" }}
            >
              <SpinPreloader spinning={loading}>
                {renderComponent}
              </SpinPreloader>
            </div>
          );
        }}
      </Query>
    );
  }
}
