# i18n monitor for iotex

## INTRO

The .yaml file in this folder records the changes in the corresponding i18n file, which is convenient for translators to view content updates. If someone updates the en.yaml file in upper folder, en.modified.yaml in this folder will reflect this change.

## FOR TRANSLATORS

For example, in en.yaml:

```yaml
auth/invalid-email: 'Email is invalid'
```

If content changes, like this:

```yaml
auth/invalid-email: 'Email is valid'
```

The contents of en.modified.yaml will contain the following content(Except the content at tail that begin with #)

```yaml
#<<----Updated Start---2019-6-15-------      # Start position of an update.

#auth/invalid-email: 'Email is invalid'      # before update
auth/invalid-email: 'Email is valid'         # updated content, need to translate.

#------Updated End-----1560608493918----->>  # End position of an update.
```

If add a new line, only the added line will be included and there is no corresponding comment content, because it is fresh.

## FOR DEVELOPERS

The source file is 'i18n.monitor.ts', so you need to compile it into a js file after updating the ts file.

You can add or remove monitoring language types in 'gulpfile.babel.js'.
