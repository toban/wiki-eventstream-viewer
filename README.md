# wikimedia-eventstream-viewer

CLI tool for listening to the eventstream and filtering out keywords

# todo

- lets get filter labels for any language from wikidata
- support selecting specific json properties?
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
| Syntax      | Description             |
| ----------- | ----------------------- |
| enter       | Apply filter            |

## Filter table

| Syntax      | Description             |
| ----------- | ----------------------- |
| w           | Up in filter hits       |
| s           | Down in filter hits     |
| esc         | Back to filter config   |
| enter       | Open page in browser    |