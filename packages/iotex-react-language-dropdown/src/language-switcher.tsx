// tslint:disable:no-var-requires
// tslint:disable:no-http-string
import React, { Component } from "react";
// import OutsideClickHandler from "react-outside-click-handler";
import { connect } from "react-redux";
import { colors } from "./style-color";
import { Languages } from "./supported-languages";

const document = require("global/document");
const window = require("global/window");

const MEDIA_DROPDOWN_MENU = `@media only screen and (maxWidth: 900px)`;

const GOTO_TRANS = "GOTO_TRANS";
const GOOGLE_TRANSLATE = "GOOGLE_TRANSLATE";

const languages = [
  { value: Languages.EN, children: "English" },
  // { value: Languages.KO, children: "한국어" },
  { value: Languages.ZH_CN, children: "简体中文" }
  // { value: Languages.RU, children: "Русский" },
  // { value: Languages.IT, children: "Italiano" },
  // { value: GOTO_TRANS, children: "Help Translation?" },
  // { value: GOOGLE_TRANSLATE, children: "Google Translation" }
];

interface State {
  displayTranslationMenu: boolean;
  linkCIndex: number;
}

interface Props {
  style?: object;
}

class LanguageSwitcher extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayTranslationMenu: false,
      linkCIndex: -1
    };
  }

  public componentDidMount(): void {
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
    window.googleTranslateElementInit = this.googleTranslateElementInit;
  }

  public googleTranslateElementInit = () => {
    const google = window.google;
    if (google) {
      return new google.translate.TranslateElement(
        { autoDisplay: false },
        "google_translate_element"
      );
    }
    return undefined;
  };

  public render(): JSX.Element {
    let uri = "";
    if (window.location) {
      uri = window.location.href;
    }

    const checkCurrentLi = (key: number) => {
      const { linkCIndex } = this.state;
      if (key === linkCIndex) {
        return colors.deltaUp;
      }
      return "white";
    };

    const { style = { width: "1em" }, ...others } = this.props;
    const translationBlock = (
      <div
        style={{
          display: this.state.displayTranslationMenu ? "block" : "none"
        }}
      >
        <LanguageMenu>
          {languages.map((o, i) => {
            if (o.value.toLowerCase() === GOTO_TRANS.toLowerCase()) {
              return (
                <LanguageItem key={i}>
                  <LAnchor
                    href="https://github.com/iotexproject/web-iotex-translations"
                    target="_blank"
                    style={{ fontSize: "14px" }}
                  >
                    {o.children}
                  </LAnchor>
                </LanguageItem>
              );
            }
            if (o.value.toLowerCase() === GOOGLE_TRANSLATE.toLowerCase()) {
              return (
                <LanguageItem key={i}>
                  <GoogleTranslateButton id="google_translate_element" />
                </LanguageItem>
              );
            }
            return (
              <LanguageItem key={i}>
                <LAnchor
                  href={updateQueryStringParameter(uri, "locale", o.value)}
                  onMouseOver={() =>
                    this.setState({
                      linkCIndex: i
                    })
                  }
                  onMouseLeave={() => {
                    this.setState({
                      linkCIndex: -1
                    });
                  }}
                  color={checkCurrentLi(i)}
                >
                  {o.children}
                </LAnchor>
              </LanguageItem>
            );
          })}
        </LanguageMenu>
      </div>
    );

    const hideTranslationMenu = () => {
      this.setState({
        displayTranslationMenu: false
      });
    };

    return (
      <Wrapper {...others}>
        <div>
          <LanguageSwitchButton
            onMouseOver={() =>
              this.setState({
                displayTranslationMenu: true
              })
            }
            onMouseLeave={() => {
              hideTranslationMenu();
            }}
            onClick={() => {
              hideTranslationMenu();
            }}
          >
            <TranslationIcon style={style} />
            {translationBlock}
          </LanguageSwitchButton>
        </div>
      </Wrapper>
    );
  }
}

// @ts-ignore
const Wrapper = ({ children, ...others }) => {
  return (
    <div
      {...others}
      style={{
        display: "flex",
        alignSelf: "center",
        [MEDIA_DROPDOWN_MENU]: {
          boxSizing: "border-box",
          width: "100%",
          padding: "0",
          lineHeight: "50px",
          height: "50px",
          margin: "2px 0",
          borderBottom: "1px #EDEDED solid"
        }
      }}
    >
      {children}
    </div>
  );
};

// @ts-ignore
const LAnchor = ({ children, href, color = "white", ...props }) => {
  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
        cursor: "pointer",
        color: color,
        fontWeight: "bold"
      }}
      {...props}
    >
      {children}
    </a>
  );
};

// @ts-ignore
const GoogleTranslateButton = ({ ...props }) => {
  return (
    <div
      {...props}
      style={{
        overflow: "hidden",
        position: "relative",
        fontSize: "10pt",
        width: "98px",
        lineHeight: "7px",
        height: "38px",
        padding: "5px 0px 10px 0px",
        marginBottom: "10px",
        [MEDIA_DROPDOWN_MENU]: {
          display: "none"
        }
      }}
    />
  );
};

// @ts-ignore
const LanguageMenu = ({ children }) => {
  return (
    <ul
      style={{
        position: "fixed",
        marginLeft: "-10px",
        lineHeight: "32px",
        backgroundColor: colors.nav01,
        width: "120px",
        marginTop: "0",
        listStyle: "none inside",
        padding: "5px 0 5px 20px",
        textAlign: "left",
        opacity: 0.96,
        [MEDIA_DROPDOWN_MENU]: {
          backgroundColor: "#fff"
        }
      }}
    >
      {children}
    </ul>
  );
};

// @ts-ignore
const LanguageSwitchButton = ({ children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: "7px 0px 0px 0px",
        backgroundColor: "transparent",
        borderStyle: "none",
        cursor: "pointer",
        ":focus": {
          outline: 0
        }
      }}
    >
      {children}
    </button>
  );
};

// @ts-ignore
const LanguageItem = ({ children }) => {
  return (
    <li
      style={{
        margin: "0px"
      }}
    >
      {children}
    </li>
  );
};

// @ts-ignore
const TranslationIcon = ({ style }) => {
  return (
    <svg
      style={style}
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="language"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      className="svg-inline--fa fa-language fa-w-20 fa-3x"
    >
      <path
        fill="currentColor"
        d="M152.1 236.2c-3.5-12.1-7.8-33.2-7.8-33.2h-.5s-4.3 21.1-7.8 33.2l-11.1 37.5H163zM616 96H336v320h280c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24zm-24 120c0 6.6-5.4 12-12 12h-11.4c-6.9 23.6-21.7 47.4-42.7 69.9 8.4 6.4 17.1 12.5 26.1 18 5.5 3.4 7.3 10.5 4.1 16.2l-7.9 13.9c-3.4 5.9-10.9 7.8-16.7 4.3-12.6-7.8-24.5-16.1-35.4-24.9-10.9 8.7-22.7 17.1-35.4 24.9-5.8 3.5-13.3 1.6-16.7-4.3l-7.9-13.9c-3.2-5.6-1.4-12.8 4.2-16.2 9.3-5.7 18-11.7 26.1-18-7.9-8.4-14.9-17-21-25.7-4-5.7-2.2-13.6 3.7-17.1l6.5-3.9 7.3-4.3c5.4-3.2 12.4-1.7 16 3.4 5 7 10.8 14 17.4 20.9 13.5-14.2 23.8-28.9 30-43.2H412c-6.6 0-12-5.4-12-12v-16c0-6.6 5.4-12 12-12h64v-16c0-6.6 5.4-12 12-12h16c6.6 0 12 5.4 12 12v16h64c6.6 0 12 5.4 12 12zM0 120v272c0 13.3 10.7 24 24 24h280V96H24c-13.3 0-24 10.7-24 24zm58.9 216.1L116.4 167c1.7-4.9 6.2-8.1 11.4-8.1h32.5c5.1 0 9.7 3.3 11.4 8.1l57.5 169.1c2.6 7.8-3.1 15.9-11.4 15.9h-22.9a12 12 0 0 1-11.5-8.6l-9.4-31.9h-60.2l-9.1 31.8c-1.5 5.1-6.2 8.7-11.5 8.7H70.3c-8.2 0-14-8.1-11.4-15.9z"
        className=""
      />
    </svg>
  );
};

// todo: move to a common file?
function updateQueryStringParameter(
  uri: string,
  key: string,
  value: string
): string {
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, "i");
  const separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, `$1${key}=${value}$2`);
  }
  return `${uri + separator + key}=${value}`;
}

export const LanguageSwitcherContainer = connect(
  (state: {
    base: { locale: string; acceptLanguage: string; localeSelected: string };
  }): object => {
    if (state.base) {
      const { locale, acceptLanguage, localeSelected } = state.base;
      return { locale, acceptLanguage, localeSelected };
    }
    return {};
  }
)(LanguageSwitcher);
