[![CircleCI](https://circleci.com/gh/puncsky/typescript-react-lib-starter.svg?style=svg)](https://circleci.com/gh/puncsky/typescript-react-lib-starter)

# typescript-react-lib-starter

A simplistic typescript lib boilerplate using React, babel, tslint, ava, and CircleCI.

```bash
nvm use 10.15.1
npm install

# test
# run all tests
npm run test
# run a single test file
npm run ava ./path/to/test-file.js
```

To run a single test case, follow instructions [here](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#running-specific-tests).

## Scripts

- `npm run build`: build source code from `src` to `dist`
- `npm publish`: publish code to npm
- `npm run changelog-patch` bump version patch (bug fixes)
- `npm run changelog-minor` bump version minor (new features)
- `npm run changelog-major` bump version major (breaking change)
