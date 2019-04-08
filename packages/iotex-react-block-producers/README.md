# iotex-react-block-producers

## Usage

```jsx
```

## Develop with dev server

```bash
npm run dev
```

## Develop with your website

```bash
npm run build

# in your website
ln -s /Users/tp/projects/iotex-react-components/packages/iotex-react-block-producers ./node_modules/iotex-react-block-producers
```

```bash
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
