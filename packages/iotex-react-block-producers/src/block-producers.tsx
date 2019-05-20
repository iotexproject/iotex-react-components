import Avatar from "antd/lib/avatar";
import notification from "antd/lib/notification";
import Table from "antd/lib/table";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
import {
  BlockProducersList,
  CustomTBpCandidate,
  RenderDelegateComponent
} from "./block-producers-list";
import {
  renderDelegateName,
  renderLiveVotes,
  renderProductivity,
  renderRank,
  tableAppendix
} from "./bp-render";
import { getClassifyDelegate } from "./partition-help";
import { SpinPreloader } from "./spin-preloader";
import { TBpCandidate } from "./types";

export const PALM_WIDTH = 575;

export const GET_BP_CANDIDATES = gql`
  query bpCandidates {
    bpCandidates {
      id
      rank
      logo
      name
      status
      category
      serverStatus
      liveVotes
      liveVotesDelta
      percent
      registeredName
      socialMedia
      productivity
      productivityBase
    }
  }
`;

const renderHook = (render: Function, customRender: Function) => (
  text: string,
  record: CustomTBpCandidate,
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
  extraMobileComponents?: Array<RenderDelegateComponent>;
  apolloClient: ApolloClient<{}>;
  height?: number;
};

type State = {
  displayMobileList: boolean;
  currentPage: number;
};

export class BlockProducers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileList: false,
      currentPage: 1
    };
  }

  public componentDidMount(): void {
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

  public getColumns(): Array<object> {
    const { extraColumns = [] } = this.props;

    return [
      {
        title: t("candidates.rank"),
        key: "index",
        dataIndex: "rank",
        render: renderRank,
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
        render: renderProductivity,
        customRender: (text: number | string) => <b>{text || ""}</b>
      },
      ...extraColumns
    ];
  }

  public render(): JSX.Element {
    const { displayMobileList } = this.state;
    const {
      extraMobileComponents,
      apolloClient
      // height = 600
    } = this.props;
    const columns = this.getColumns();
    columns.map(i => {
      // @ts-ignore
      i.render = renderHook(i.render, i.customRender);
      return i;
    });

    return (
      <Query client={apolloClient} query={GET_BP_CANDIDATES} ssr={true}>
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
            (data && data.bpCandidates) || [],
            false
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
              pagination={false}
              dataSource={dataSource}
              columns={columns}
              rowKey={"rank"}
              // scroll={{ y: height }}
            />
          );

          return (
            <div
              className={"table-list"}
              style={{
                backgroundColor: "transparent",
                padding: "20pt",
                boxShadow:
                  "0 5pt 10pt rgba(128,128,128,0.3), 0 5pt 10pt rgba(128,128,128,0.3)",
                borderRadius: "5pt"
              }}
            >
              <SpinPreloader spinning={loading}>
                {tableAppendix(displayMobileList)}
                {renderComponent}
              </SpinPreloader>
            </div>
          );
        }}
      </Query>
    );
  }
}
