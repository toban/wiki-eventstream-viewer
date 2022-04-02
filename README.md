# wiki-eventstream-viewer

This is not a wikimedia project but just uses the wikimedia eventstream.

CLI tool for listening to the eventstream and filtering out keywords

**This code is hacky and untested and will probably be broken from time to time.**

# todo

- lets get filter labels for any language from wikidata
- support selecting specific json properties?
- add filter for negations 
## Install

```bash
npm install
npm run start
```

Filtering on random things on recent_changes events

The upper table is filter hits, the lower part is latest events.

![demo](/images/demo.gif)

## Keyboard shortcuts

## Filter configuration

This is the first menu, you need to enter a comma separated filter.

| Syntax      | Description             |
| ----------- | ----------------------- |
| enter       | Apply filter            |

## Filter table

After filter is configured any hits on the `event.data` object will land in the upper most table.

| Syntax      | Description             |
| ----------- | ----------------------- |
| w           | Up in filter hits       |
| s           | Down in filter hits     |
| esc         | Back to filter config   |
| enter       | Open page in browser    |