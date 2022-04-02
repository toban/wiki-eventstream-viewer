"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const open_1 = __importDefault(require("open"));
const ui_1 = require("./ui");
const FilterTable = (props) => {
    const [selectedIndex, setSelectedIndex] = react_1.default.useState(0);
    (0, ink_1.useInput)((input, key) => {
        switch (props.appMenuState) {
            case ui_1.Ui.FilterTable:
                if (input == 'w') {
                    setSelectedIndex(Math.max(0, selectedIndex - 1));
                }
                if (input == 's') {
                    setSelectedIndex(Math.min(props.filteredEvents.length - 1, selectedIndex + 1));
                }
                if (key.return) {
                    const event = props.filteredEvents[selectedIndex];
                    if (!event) {
                        return;
                    }
                    if (event === null || event === void 0 ? void 0 : event.uri) {
                        (0, open_1.default)(event.uri);
                    }
                }
                break;
        }
    });
    return react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", height: props.filteredEvents.length, width: "100%" },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Domain")),
                react_1.default.createElement(ink_1.Box, { width: "5%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Time")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "User")),
                react_1.default.createElement(ink_1.Box, { width: "65%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Title")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Match"))),
            /* [...domains.keys()] */
            props.filteredEvents.map((event, index) => {
                const selected = index == selectedIndex;
                const rowColor = selected ? "yellow" : "white";
                return (react_1.default.createElement(ink_1.Box, { key: event.id },
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.domain)),
                    react_1.default.createElement(ink_1.Box, { width: "5%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.time)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.user)),
                    react_1.default.createElement(ink_1.Box, { width: "65%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.title)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.matches))));
            })),
        react_1.default.createElement(ink_1.Newline, null),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", height: props.domains.length, width: "100%" },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Domain")),
                react_1.default.createElement(ink_1.Box, { width: "5%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Events")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Last user")),
                react_1.default.createElement(ink_1.Box, { width: "75%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Last title"))),
            /* [...domains.keys()] */
            props.domains.map((currentDomain) => {
                const lastEvent = currentDomain.eventBuffer[currentDomain.eventBuffer.length - 1];
                return (react_1.default.createElement(ink_1.Box, { key: currentDomain.domain },
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, null, currentDomain.domain)),
                    react_1.default.createElement(ink_1.Box, { width: "5%" },
                        react_1.default.createElement(ink_1.Text, null, currentDomain.numEvents)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, null, lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.user)),
                    react_1.default.createElement(ink_1.Box, { width: "75%" },
                        react_1.default.createElement(ink_1.Text, null, lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.title))));
            })));
};
module.exports = FilterTable;
exports.default = FilterTable;
