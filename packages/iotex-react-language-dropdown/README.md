# iotex-react-language-dropdown

## how to use in your project

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
## Scripts

- `npm run dev`: develop react component
- `npm run build`: build source code from `src` to `dist`
- `npm publish`: publish code to npm
- `npm run changelog-patch` bump version patch (bug fixes)
- `npm run changelog-minor` bump version minor (new features)
- `npm run changelog-major` bump version major (breaking change)
