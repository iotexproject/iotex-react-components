[![CircleCI](https://circleci.com/gh/iotexproject/iotex-react-components.svg?style=svg)](https://circleci.com/gh/iotexproject/iotex-react-components)

# iotex-react-components

```bash
npm run bootstrap
npm run test
```

# how to use in your project

base use(default show all languages menu):

```bash
import LanguageSwitcher from "iotex-react-language-dropdown";
<LanguageSwitcher/>
```

setting user languages menu, eg:

```bash
import { Languages } from "iotex-react-language-dropdown";
<LanguageSwitcher supportLanguages={[Languages.EN, Languages.ZH_CN]}/>
```

use google tools(default false), eg:

```bash
<LanguageSwitcher googleTools={true}/>
```
