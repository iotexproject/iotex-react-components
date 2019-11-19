// tslint:disable:no-any
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
import { DelegatesOfMonth, TBpCandidate } from "./types";

// @ts-ignore
import withStyles, { WithStyles } from "react-jss";

export const PALM_WIDTH = 575;
export const media960 = 960;

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

export const GET_ADMIN_SETTING = gql`
  query adminSetting($key: String!) {
    adminSetting(key: $key)
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

const styles = {
  BpTableContainer: {
    "& .ant-table-thead > tr > th": {
      position: "sticky",
      top: 0,
      zIndex: 1
    }
  }
};

interface IProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  height: string;
  classes: any;
}

// @ts-ignore
const Div: React.FunctionComponent<IProps> = ({ classes, children }) => (
  <div className={classes.BpTableContainer}>{children}</div>
);

const BpTableContainer = withStyles(styles)(Div);

type Props = {
  extraColumns?: Array<object>;
  extraMobileComponents?: Array<RenderDelegateComponent>;
  apolloClient: ApolloClient<{}>;
  badgeImg: string;
  height?: string;
};

type State = {
  displayMobileList: boolean;
  hideColumns: boolean;
  currentPage: number;
};

export class BlockProducers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileList: false,
      hideColumns: false,
      currentPage: 1
    };
  }

  public componentDidMount(): void {
    if (
      document.documentElement &&
      document.documentElement.clientWidth <= media960
    ) {
      this.setState({ displayMobileList: true });
      if (document.documentElement.clientWidth <= PALM_WIDTH) {
        this.setState({ hideColumns: true });
      }
    }
    window.addEventListener("resize", () => {
      if (
        document.documentElement &&
        document.documentElement.clientWidth > PALM_WIDTH
      ) {
        this.setState({ hideColumns: false });
        if (document.documentElement.clientWidth > media960) {
          this.setState({ displayMobileList: false });
        }
      } else {
        this.setState({ displayMobileList: true, hideColumns: true });
      }
    });
  }

  public getColumns(): Array<object> {
    const { badgeImg, extraColumns = [] } = this.props;

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
        title: t("candidate.delegate_badges"),
        dataIndex: "badges",
        key: "badges",
        render: (text: number) => {
          const count = typeof text === "number" ? text : parseInt(text, 10);

          return (
            !!count && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {Array(count)
                  .fill("")
                  .map((_, idx: number) => (
                    <img
                      src={badgeImg}
                      key={idx}
                      style={{ marginRight: "6px", width: "30px" }}
                      alt="badges"
                    />
                  ))}
              </div>
            )
          );
        }
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

  private getList(
    dataSource: Array<CustomTBpCandidate>,
    sectionRow: Array<number>
  ): JSX.Element {
    const { displayMobileList, hideColumns } = this.state;
    const { extraMobileComponents } = this.props;
    const columns = this.getColumns();
    columns.map(i => {
      // @ts-ignore
      i.render = renderHook(i.render, i.customRender);
      return i;
    });

    return displayMobileList ? (
      <BlockProducersList
        dataSource={dataSource}
        hideColumns={hideColumns}
        extraComponents={extraMobileComponents}
      />
    ) : (
      <BpTableContainer>
        <Table
          // @ts-ignore
          rowClassName={(record, index) =>
            // @ts-ignore
            sectionRow.includes(index) ? "ant-table-section-row " : ""
          }
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowKey={"rank"}
        />
      </BpTableContainer>
    );
  }

  public render(): JSX.Element {
    const { displayMobileList } = this.state;
    const { apolloClient } = this.props;

    return (
      <Query
        client={apolloClient}
        query={GET_BP_CANDIDATES}
        ssr={false}
        fetchPolicy="network-only"
      >
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

          const sectionRow = dataSource.reduce(
            // @ts-ignore
            (r, v, i) => r.concat(v.custom ? i : []),
            []
          );

          const containerStyles = displayMobileList
            ? {}
            : {
                backgroundColor: "transparent",
                padding: "20px",
                border: "1px solid rgba(128, 128, 128, 0.3)",
                borderRadius: "5px"
              };

          return (
            <div className={"table-list"} style={containerStyles}>
              <SpinPreloader spinning={loading}>
                {tableAppendix(displayMobileList)}
                <Query
                  client={apolloClient}
                  query={GET_ADMIN_SETTING}
                  variables={{ key: "delegatesOfMonth" }}
                  ssr={false}
                  fetchPolicy="network-only"
                >
                  {({
                    loading,
                    error,
                    data
                  }: QueryResult<{ adminSetting: DelegatesOfMonth }>) => {
                    if (!loading && error) {
                      return null;
                    }

                    const { delegates } = (data && data.adminSetting) || {
                      delegates: []
                    };

                    delegates.forEach(({ id, badges }: TBpCandidate) => {
                      const target = dataSource.find(item => item.id === id);
                      if (target) {
                        target.badges = badges;
                      }
                    });

                    return this.getList(dataSource, sectionRow);
                  }}
                </Query>
              </SpinPreloader>
            </div>
          );
        }}
      </Query>
    );
  }
}
