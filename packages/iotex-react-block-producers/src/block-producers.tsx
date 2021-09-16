// tslint:disable:no-any
import Avatar from "antd/lib/avatar";
import notification from "antd/lib/notification";
import Popover from "antd/lib/popover";
import Table, { ColumnProps } from "antd/lib/table";
import Column from "antd/lib/table/Column";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { Query, QueryResult } from "react-apollo";
// @ts-ignore
import withStyles, { WithStyles } from "react-jss";
import {
  BlockProducersList,
  CustomTBpCandidate,
  RenderDelegateComponent
} from "./block-producers-list";
import {
  getBadgeContent,
  getBadgesTitle,
  renderDelegateName,
  renderLiveVotes,
  renderProductivity,
  renderRank,
  tableAppendix
} from "./bp-render";
import { getClassifyDelegate, isProbation } from "./partition-help";
import { SpinPreloader } from "./spin-preloader";
import { DelegatesOfMonth, TBpCandidate } from "./types";

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
      nodeVersion
      percent
      registeredName
      socialMedia
      productivity
      productivityBase
      blockRewardPortion
      epochRewardPortion
      foundationRewardPortion
      rewardPlan
      badges
      probation {
        count
      }
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
  },
  probation: {}
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

interface ColumnMapItem extends ColumnProps<any> {
  wrapRender?: (
    renderRes: any,
    text: any,
    record: any,
    index: number
  ) => JSX.Element;
}

type Props = {
  extraColumns?: Array<object>;
  extraMobileComponents?: Array<RenderDelegateComponent>;
  apolloClient: ApolloClient<{}>;
  badgeImg: string;
  height?: string;
  columnsTitleReplace?: Array<{ key: string; title: string }>;
  columnsMap?: Record<string, ColumnMapItem>;
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
    const {
      badgeImg,
      extraColumns = [],
      columnsTitleReplace,
      columnsMap
    } = this.props;
    const columns: Array<{ [k: string]: any }> = [
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
        render: (badges: any) => {
          return (
            !!badges.length && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {badges.map((badge: string, idx: number) => {
                  const src = badge === "hermes" ? badgeImg : badge;
                  return (
                    <Popover
                      placement="bottomLeft"
                      title={getBadgesTitle(badge)}
                      content={getBadgeContent(badge)}
                    >
                      <img
                        src={src}
                        key={idx}
                        style={{ marginRight: "6px", width: "24px" }}
                        alt="badges"
                      />
                    </Popover>
                  );
                })}
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
        title: t("candidate.epoch_progress"),
        dataIndex: "productivity",
        key: "epochProgress",
        render: renderProductivity,
        customRender: (text: number | string) => <b>{text || ""}</b>
      },
      ...extraColumns
    ];

    // replace column title
    if (columnsTitleReplace && columnsTitleReplace.length) {
      columnsTitleReplace.forEach(col => {
        const item = columns.find(defaultCol => defaultCol.key === col.key);
        if (item) {
          item.title = col.title;
        }
      });
    }
    if (columnsMap) {
      columns.forEach(column => {
        if (columnsMap[column.dataIndex]) {
          Object.assign(column, columnsMap[column.dataIndex]);
          if (column.wrapRender) {
            const render = column.render;
            column.render = (text: any, record: any, index: number) => {
              return column.wrapRender(
                render && render(text, record, index),
                text,
                record,
                index
              );
            };
          }
        }
      });
    }

    return columns;
  }

  private getList(
    dataSource: Array<CustomTBpCandidate>,
    sectionRow: Array<number>
  ): JSX.Element {
    const { displayMobileList, hideColumns } = this.state;
    const {
      badgeImg,
      extraMobileComponents,
      columnsTitleReplace = []
    } = this.props;
    const columns = this.getColumns();
    columns.map(i => {
      // @ts-ignore
      i.render = renderHook(i.render, i.customRender);
      return i;
    });

    if (displayMobileList) {
      return (
        <BlockProducersList
          dataSource={dataSource}
          hideColumns={hideColumns}
          extraComponents={extraMobileComponents}
          badgeImg={badgeImg}
          columnsTitleReplace={columnsTitleReplace}
        />
      );
    } else {
      const StyleTable: React.FunctionComponent<IProps> = ({
        classes,
        children
      }) => (
        <Table
          // @ts-ignore
          rowClassName={(record, index) => {
            const probation = isProbation(record);
            const subClass = probation ? classes.probation : "";
            // @ts-ignore
            return sectionRow.includes(index)
              ? `ant-table-section-row ${subClass}`
              : `${subClass}`;
          }}
          pagination={false}
          dataSource={dataSource}
          columns={columns}
          rowKey={"rank"}
        >
          {children}
        </Table>
      );
      const StyleTableInner = withStyles(styles)(StyleTable);
      return (
        <BpTableContainer>
          <StyleTableInner />
        </BpTableContainer>
      );
    }
  }

  public render(): JSX.Element {
    const { displayMobileList } = this.state;
    const { apolloClient } = this.props;

    return (
      <Query
        client={apolloClient}
        query={GET_BP_CANDIDATES}
        ssr={false}
        fetchPolicy="no-cache"
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
                  fetchPolicy="no-cache"
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
