"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuOption = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const streams = [
    // "eventgate-main.test.event",
    // "mediawiki.page-create",
    // "mediawiki.page-delete",
    // "mediawiki.page-links-change",
    // "mediawiki.page-move",
    // "mediawiki.page-properties-change",
    // "mediawiki.page-undelete",
    // "mediawiki.recentchange",
    // "mediawiki.revision-create",
    // "mediawiki.revision-score",
    // "mediawiki.revision-visibility-change",
    "page-create",
    "page-delete",
    "page-links-change",
    "page-move",
    "page-properties-change",
    "page-undelete",
    "recentchange",
    "revision-create",
    "revision-score",
    // "test"
];
var menuOption;
(function (menuOption) {
    menuOption[menuOption["Start"] = -2] = "Start";
    menuOption[menuOption["All"] = -1] = "All";
})(menuOption = exports.menuOption || (exports.menuOption = {}));
const StreamSelector = () => {
    const [selectedIndex, setSelectedIndex] = react_1.default.useState(menuOption.Start);
    const [selectedStreams, setSelectedStreams] = react_1.default.useState(streams.map(() => true));
    (0, ink_1.useInput)((input, key) => {
        if (input == 'w') {
            setSelectedIndex(Math.max(-2, selectedIndex - 1));
        }
        if (input == 's') {
            setSelectedIndex(Math.min(streams.length - 1, selectedIndex + 1));
        }
        if (key.return) {
            if (selectedIndex == menuOption.All) {
                setSelectedStreams(prev => {
                    return prev.map((x) => !x);
                });
            }
            else if (selectedIndex == menuOption.Start) {
            }
            else {
                setSelectedStreams(prev => {
                    prev[selectedIndex] = !prev[selectedIndex];
                    return prev;
                });
            }
        }
    });
    return react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Box, { borderStyle: "classic", width: "3" },
                react_1.default.createElement(ink_1.Text, { color: selectedIndex == menuOption.Start ? "yellow" : "white" }, "START")),
            react_1.default.createElement(ink_1.Box, { display: selectedIndex == menuOption.Start ? "flex" : "none" },
                react_1.default.createElement(ink_1.Text, { color: selectedIndex == menuOption.Start ? "yellow" : "white" },
                    " ",
                    "\n   <---- Press ENTER to start!",
                    " "))),
        react_1.default.createElement(ink_1.Box, { borderStyle: "classic", flexDirection: "column" },
            react_1.default.createElement(ink_1.Box, { flexDirection: "column", height: streams.length, width: "100%" },
                react_1.default.createElement(ink_1.Box, null,
                    react_1.default.createElement(ink_1.Box, { width: "5" },
                        react_1.default.createElement(ink_1.Text, { color: selectedIndex == menuOption.All ? "yellow" : "white", bold: true }, "ALL")),
                    react_1.default.createElement(ink_1.Box, null,
                        react_1.default.createElement(ink_1.Text, { color: selectedIndex == menuOption.All ? "yellow" : "white", bold: true }, "Name"))),
                /* [...domains.keys()] */
                streams.map((stream, index) => {
                    const selected = selectedStreams[index];
                    const selectedUi = index == selectedIndex;
                    const rowColor = selectedUi ? "yellow" : "white";
                    return (react_1.default.createElement(ink_1.Box, { key: stream },
                        react_1.default.createElement(ink_1.Box, { width: "5" },
                            react_1.default.createElement(ink_1.Text, { color: rowColor },
                                "[",
                                selected ? 'X' : ' ',
                                "]")),
                        react_1.default.createElement(ink_1.Box, null,
                            react_1.default.createElement(ink_1.Text, { color: rowColor }, stream))));
                }))));
};
module.exports = StreamSelector;
exports.default = StreamSelector;
