"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const eventsource_1 = __importDefault(require("eventsource"));
const open_1 = __importDefault(require("open"));
const App = () => {
    const bufferSize = 10;
    const maxHeight = 20;
    const selectedDomain = "en.wikipedia.org";
    const [selectedIndex, setSelectedIndex] = react_1.default.useState(0);
    const [domains, setDomains] = react_1.default.useState(new Map());
    const [domainStack, setDomainStack] = react_1.default.useState([]);
    const [filterBuffer, setFilterBuffer] = react_1.default.useState([]);
    const [socket, setSocket] = react_1.default.useState();
    react_1.default.useEffect(() => {
        const newSocket = new eventsource_1.default('https://stream.wikimedia.org/v2/stream/recentchange');
        setSocket(newSocket);
        newSocket.onmessage = onMessage;
        return () => newSocket.close();
    }, []);
    (0, ink_1.useInput)((input, key) => {
        if (input == 'q') {
            console.log('should exit');
        }
        if (input == 'w') {
            setSelectedIndex(Math.max(0, selectedIndex - 1));
        }
        if (input == 's') {
            setSelectedIndex(Math.min(filterBuffer.length - 1, selectedIndex + 1));
        }
        if (key.return) {
            const event = filterBuffer[selectedIndex];
            if (!event) {
                return;
            }
            if (event === null || event === void 0 ? void 0 : event.uri) {
                (0, open_1.default)(event.uri);
            }
        }
    });
    const onMessage = function (event) {
        if (event.type == 'message') {
            const parsedData = JSON.parse(event.data);
            const domain = parsedData.meta.domain;
            var filterstrings = ['ukraine', 'russia'];
            var regex = new RegExp(filterstrings.join("|"), "i");
            if (regex.test(event.data)) {
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
                return [parsedData.meta.domain, ...prevStack.filter(x => x !== parsedData.meta.domain && x !== selectedDomain)].slice(0, maxHeight);
            });
            // setData(previousData => [
            // 	...previousData,
            // 	{
            // 		domain: domain,
            // 		title: parsedData.title
            // 	}
            // ]);
        }
    };
    return react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { color: "green" }, (socket === null || socket === void 0 ? void 0 : socket.readyState) == 1 ? "✅" : "❌")),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", height: filterBuffer.length, width: "100%" },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Domain")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Time")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "User")),
                react_1.default.createElement(ink_1.Box, { width: "70%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Title"))),
            /* [...domains.keys()] */
            filterBuffer.map((event, index) => {
                const selected = index == selectedIndex;
                const rowColor = selected ? "yellow" : "white";
                return (react_1.default.createElement(ink_1.Box, { key: event.id },
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.domain)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.time)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.user)),
                    react_1.default.createElement(ink_1.Box, { width: "70%" },
                        react_1.default.createElement(ink_1.Text, { color: rowColor }, event.title))));
            })),
        react_1.default.createElement(ink_1.Newline, null),
        react_1.default.createElement(ink_1.Box, { flexDirection: "column", height: domainStack.length, width: "100%" },
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Domain")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Events")),
                react_1.default.createElement(ink_1.Box, { width: "10%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Last user")),
                react_1.default.createElement(ink_1.Box, { width: "70%" },
                    react_1.default.createElement(ink_1.Text, { bold: true }, "Last title"))),
            /* [...domains.keys()] */
            domainStack.map((domain) => {
                const currentDomain = domains.get(domain);
                if (!currentDomain) {
                    return;
                }
                const lastEvent = currentDomain.eventBuffer[currentDomain.eventBuffer.length - 1];
                return (react_1.default.createElement(ink_1.Box, { key: domain },
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, null, domain)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, null, currentDomain.numEvents)),
                    react_1.default.createElement(ink_1.Box, { width: "10%" },
                        react_1.default.createElement(ink_1.Text, null, lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.user)),
                    react_1.default.createElement(ink_1.Box, { width: "70%" },
                        react_1.default.createElement(ink_1.Text, null, lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.title))));
            })));
};
/* <Text color="green">{ data.length > 0 ? data[data.length-1]?.domain : "nothing" }</Text>
    <Text color="yellow">{ data.length > 0 ? data[data.length-1]?.title : "nothing" }</Text> */
module.exports = App;
exports.default = App;
