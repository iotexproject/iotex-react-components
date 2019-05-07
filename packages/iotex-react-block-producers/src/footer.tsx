import Avatar from "antd/lib/avatar";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import { styled } from "onefx/lib/styletron-react";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { contentPadding } from "./style-padding";
import { colors } from "./style-color";
import { media } from "./style-media";

export const FOOTER_HEIGHT = 325;


const images = [
  {
    src: "/footer/twitter.png",
    href: "https://twitter.com/iotex_io"
  },
  {
    src: "/footer/t.me.png",
    href: "https://t.me/IoTeXGroup"
  },
  {
    src: "/footer/reddit.png",
    href: "https://www.reddit.com/r/IoTeX/"
  },
  {
    src: "/footer/medium.png",
    href: "https://medium.com/iotex"
  },
  {
    src: "/footer/youtube.png",
    href: "https://www.youtube.com/channel/UCdj3xY3LCktuamvuFusWOZw"
  },
  {
    src: "/footer/facebook.png",
    href: "https://www.facebook.com/iotex.io/"
  },
  {
    src: "/footer/instagram.png",
    href:
      "https://instagram.com/iotexproject?utm_source=ig_profile_share&igshid=n1x5vxo61e00"
  }
];

export function Footer(): JSX.Element {
  const links = [
    {
      name: t("footer.resources"),
      value: [
        {
          name: t("footer.lauch"),
          href: "https://www.launch.iotex.io/"
        },
        {
          name: t("footer.roadmap"),
          href: ""
        },
        {
          name: t("footer.research_paper"),
          href: "https://iotex.io/academics"
        },
        {
          name: t("footer.announcemenets"),
          href: "https://iotex.io/feed"
        },
        {
          name: t("footer.delegates_program"),
          href: "https://member.iotex.io/"
        },
        {
          name: t("footer.charity_program"),
          href: "https://iotex.io/charity"
        }
      ]
    },
    {
      name: t("footer.develop"),
      value: [
        {
          name: t("footer.github"),
          href: "https://github.com/iotexproject"
        },
        {
          name: t("footer.documentations"),
          href: "https://docs.iotex.io/"
        },
        {
          name: t("footer.libraries_tools"),
          href: "https://docs.iotex.io/docs/libraries-and-tools.html"
        },
        {
          name: t("footer.explorer"),
          href: "https://iotexscan.io/"
        },
        {
          name: t("footer.wallet"),
          href: "https://iotexscan.io/wallet"
        }
      ]
    },
    {
      name: t("footer.about_us"),
      value: [
        {
          name: t("footer.team"),
          href: "https://iotex-web-master.herokuapp.com/about"
        },
        {
          name: t("footer.forum"),
          href: "https://forum.iotex.io/"
        },
        {
          name: t("footer.support"),
          href: "https://iotex.zendesk.com/hc/en-us"
        }
      ]
    }
  ];
  return (
    <FooterWrapper>
      <Align>
        <Flex>
          {links.map((link, i) => (
            <LinkWrapper key={i}>
              <Title>{link.name}</Title>
              {link.value.map((res, j) => (
                <div key={`${i}-${j}`}>
                  <Link href={res.href}>{res.name}</Link>
                </div>
              ))}
            </LinkWrapper>
          ))}
          <FooterRight>
            <FooterInput placeholder={"Enter email for IoTeX updates!"} />
            <FooterButton>{t("footer.subscribe")}</FooterButton>
            <FooterImages>
              {images.map((image, index) => (
                <a key={index} href={image.href}>
                  <FooterAvatar src={assetURL(image.src)} />
                </a>
              ))}
            </FooterImages>
          </FooterRight>
        </Flex>
      </Align>
      <FooterBottom>
        <span>
          <span>© 2019 IoTeX</span>
          <Team href={"https://iotex.io/policy"}>{t("footer.policy")}</Team>
        </span>
      </FooterBottom>
    </FooterWrapper>
  );
}

const Flex = styled("div", {
  display: "flex",
  alignItems: "top",
  width: "100%",
  justifyContent: "space-between"
});

const Team = styled("a", {
  marginLeft: "50px",
  textDecoration: "underline",
  color: "#dbdbdb"
});

const LinkWrapper = styled("div", {
  marginRight: "20px",
  [media.media1024]: { marginRight: 0 }
});

const FooterInput = styled(Input, {
  backgroundColor: colors.nav02,
  width: "220px",
  height: "48px",
  color: "#dbdbdb",
  borderColor: "#fff",
  borderRadius: 0
});

const FooterAvatar = styled(Avatar, {
  backgroundColor: colors.nav02,
  width: "40px",
  height: "40px",
  marginLeft: "10px",
  [media.media1024]: {
    marginLeft: 0,
    marginRight: "10px",
    width: "36px",
    height: "36px"
  }
});

const FooterRight = styled("div", {
  flex: "none",
  textAlign: "right",
  [media.media1024]: {
    width: "100%",
    marginTop: "16px",
    marginBottom: "10px",
    paddingLeft: 0,
    textAlign: "left"
  }
});

const FooterBottom = styled("div", {
  textAlign: "center",
  color: "#dbdbdb"
});

const FooterButton = styled(Button, {
  backgroundColor: colors.nav02,
  width: "90px",
  height: "48px",
  color: "#dbdbdb",
  borderColor: "#fff",
  borderRadius: 0,
  marginLeft: "8px",
  ":hover": {
    color: colors.nav02
  }
});

const Title = styled("div", {
  fontSize: "16px",
  lineHeight: 2,
  color: "#dbdbdb",
  [media.media1024]: { lineHeight: 1.5 }
});

const Link = styled("a", {
  fontSize: "14px",
  lineHeight: 2,
  color: "#0fcdc9",
  [media.media1024]: { lineHeight: 1.5 }
});

const FooterImages = styled("div", {
  marginTop: "32px",
  [media.media1024]: { marginTop: "10px" }
});

const FooterWrapper = styled("div", {
  ...contentPadding,
  paddingTop: "32px",
  paddingBottom: "32px",
  height: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02,
  color: colors.white,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  [media.media1024]: {
    minWidth: 0,
    paddingTop: "16px",
    paddingBottom: "16px"
  }
});
const Align = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%"
});
