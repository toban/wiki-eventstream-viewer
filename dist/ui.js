"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ui = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const eventsource_1 = __importDefault(require("eventsource"));
const filter_table_1 = __importDefault(require("./filter_table"));
const ink_text_input_1 = __importDefault(require("ink-text-input"));
var Ui;
(function (Ui) {
    Ui[Ui["FilterConfig"] = 1] = "FilterConfig";
    Ui[Ui["FilterTable"] = 2] = "FilterTable";
})(Ui = exports.Ui || (exports.Ui = {}));
const App = () => {
    var _a, _b;
    const bufferSize = 10;
    const maxHeight = 20;
    const [domains, setDomains] = react_1.default.useState(new Map());
    const [domainStack, setDomainStack] = react_1.default.useState([]);
    const [filterBuffer, setFilterBuffer] = react_1.default.useState([]);
    const [menuState, setMenuState] = react_1.default.useState(Ui.FilterConfig);
    const [query, setQuery] = react_1.default.useState('');
    const [socket, setSocket] = react_1.default.useState();
    react_1.default.useEffect(() => {
        const newSocket = new eventsource_1.default('https://stream.wikimedia.org/v2/stream/recentchange');
        setSocket({ socket: newSocket, filter: undefined });
        newSocket.onmessage = onMessage;
        return () => newSocket.close();
    }, []);
    (0, ink_1.useInput)((input, key) => {
        switch (menuState) {
            case Ui.FilterConfig:
                if (key.return) {
                    const filterElements = query.split(',');
                    if (filterElements.length > 0) {
                        var filterString = filterElements.map(x => x.trim()).join("|");
                        setSocket(prevSocket => {
                            if (prevSocket) {
                                prevSocket.filter = new RegExp(filterString, "i");
                                prevSocket.socket.onmessage = onMessage;
                            }
                            return prevSocket;
                        });
                        setMenuState(Ui.FilterTable);
                    }
                }
                break;
            case Ui.FilterTable:
                if (key.escape) {
                    setFilterBuffer([]);
                    setMenuState(Ui.FilterConfig);
                }
                break;
        }
        if (input == 'q') {
        }
    });
    const onMessage = function (event) {
        if (event.type == 'message') {
            const parsedData = JSON.parse(event.data);
            const domain = parsedData.meta.domain;
            if (socket === null || socket === void 0 ? void 0 : socket.filter) {
                if (socket.filter.test(event.data)) {
                    setFilterBuffer(previousFilterBuffer => [
                        {
                            domain: domain,
                            title: parsedData.title,
                            user: parsedData.user,
                            uri: parsedData.meta.uri,
                            id: parsedData.meta.id,
                            date: parsedData.meta.dt.slice(0, 10),
                            time: parsedData.meta.dt.slice(11, 19)
                        },
                        ...previousFilterBuffer
                    ].slice(0, maxHeight));
                }
            }
            setDomains(previousDomains => {
                var currentDomain = previousDomains.get(domain);
                if (!currentDomain) {
                    currentDomain = { domain: domain, title: "asdf", numEvents: 0, eventBuffer: [] };
                }
                if (currentDomain.eventBuffer.length >= bufferSize) {
                    currentDomain.eventBuffer.pop();
                }
                currentDomain.eventBuffer.push({
                    domain: domain,
                    title: parsedData.title,
                    user: parsedData.user,
                    uri: parsedData.meta.uri,
                    id: parsedData.meta.id,
                    date: parsedData.meta.dt.slice(0, 10),
                    time: parsedData.meta.dt.slice(11, 19)
                });
                currentDomain.numEvents += 1;
                return new Map(previousDomains).set(domain, currentDomain);
            });
            setDomainStack(prevStack => {
                return [parsedData.meta.domain, ...prevStack.filter(x => x !== parsedData.meta.domain)].slice(0, maxHeight);
            });
        }
    };
    return react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { color: "green" },
                ((_a = socket === null || socket === void 0 ? void 0 : socket.socket) === null || _a === void 0 ? void 0 : _a.readyState) == 1 ? "✅" : "❌",
                " ", (_b = socket === null || socket === void 0 ? void 0 : socket.filter) === null || _b === void 0 ? void 0 :
                _b.source)),
        react_1.default.createElement(ink_1.Box, { display: menuState == Ui.FilterConfig ? "flex" : "none", borderStyle: "classic" },
            react_1.default.createElement(ink_1.Text, null, "Filter: "),
            react_1.default.createElement(ink_text_input_1.default, { value: query, onChange: setQuery })),
        react_1.default.createElement(ink_1.Box, { display: menuState == Ui.FilterTable ? "flex" : "none" },
            react_1.default.createElement(filter_table_1.default, { filteredEvents: filterBuffer, domains: domainStack.map(d => domains.get(d)), appMenuState: menuState })));
};
module.exports = App;
exports.default = App;
