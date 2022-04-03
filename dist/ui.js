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
    var _a;
    const bufferSize = 10;
    const maxHeight = 20;
    const [numEvents, setNumEvents] = react_1.default.useState(0);
    const [numFilteredEvents, setNumFilteredEvents] = react_1.default.useState(0);
    const [domains, setDomains] = react_1.default.useState(new Map());
    const [domainStack, setDomainStack] = react_1.default.useState([]);
    const [filterBuffer, setFilterBuffer] = react_1.default.useState([]);
    const [menuState, setMenuState] = react_1.default.useState(Ui.FilterConfig);
    const [query, setQuery] = react_1.default.useState('');
    const [socket, setSocket] = react_1.default.useState();
    react_1.default.useEffect(() => {
        const newSocket = new eventsource_1.default('https://stream.wikimedia.org/v2/stream/page-create,page-delete,page-links-change,page-move,page-properties-change,page-undelete,recentchange,revision-create,revision-score');
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
    const parseUser = function (data) {
        var _a;
        return data.user ? data.user : (_a = data.performer) === null || _a === void 0 ? void 0 : _a.user_text;
    };
    const onMessage = function (event) {
        if (event.type == 'message') {
            setNumEvents(prev => prev + 1);
            const parsedData = JSON.parse(event.data);
            const domain = parsedData.meta.domain;
            const user = parseUser(parsedData);
            const uri = parsedData.meta.uri.replace('https://' + domain, '');
            if (socket === null || socket === void 0 ? void 0 : socket.filter) {
                //const matches = event.data.match(socket.filter);
                if (socket.filter.test(event.data)) { //matches && matches.length ) {
                    setNumFilteredEvents(prev => prev + 1);
                    setFilterBuffer(previousFilterBuffer => [
                        {
                            domain: domain,
                            title: parsedData.title,
                            user: user,
                            uri: uri,
                            id: parsedData.meta.id,
                            date: parsedData.meta.dt.slice(0, 10),
                            time: parsedData.meta.dt.slice(11, 19),
                            matches: [],
                            stream: parsedData.meta.stream
                        },
                        ...previousFilterBuffer
                    ].slice(0, maxHeight));
                }
            }
            // setDomains(previousDomains => {
            // 	var currentDomain = previousDomains.get(domain);
            // 	if( !currentDomain ) {
            // 		currentDomain = {domain: domain, title: "asdf", numEvents: 0, lastEvent: {
            // 			domain: domain,
            // 			title: parsedData.title,
            // 			user: user,
            // 			uri: parsedData.meta.uri,
            // 			id: parsedData.meta.id,
            // 			date: parsedData.meta.dt.slice(0,10),
            // 			time: parsedData.meta.dt.slice(11,19),
            // 			stream: parsedData.meta.stream
            // 		}}
            // 	}
            // 	//if( currentDomain.eventBuffer.length >= bufferSize ) {
            // 	//	currentDomain.eventBuffer.pop();
            // 	//}
            // 	//currentDomain.eventBuffer.push(
            // 	//currentDomain?.lastEvent =	
            // 	//)
            // 	currentDomain.numEvents+=1;
            // 	return previousDomains.set(domain, currentDomain)
            // });
            // setDomainStack( prevStack => {
            // 	const currentIndex = prevStack.indexOf(parsedData.meta.domain);
            // 	if(currentIndex == -1) {
            // 		return [parsedData.meta.domain, ...prevStack].slice(0, maxHeight)
            // 	} 
            // 	prevStack.splice(currentIndex, 1)
            // 	return [parsedData.meta.domain, ...prevStack]  
            // })
        }
    };
    return react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { color: "green" },
                ((_a = socket === null || socket === void 0 ? void 0 : socket.socket) === null || _a === void 0 ? void 0 : _a.readyState) == 1 ? "✅" : "❌",
                " ")),
        react_1.default.createElement(ink_1.Box, { display: menuState == Ui.FilterConfig ? "flex" : "none", borderStyle: "classic" },
            react_1.default.createElement(ink_1.Text, null, "Filter: "),
            react_1.default.createElement(ink_text_input_1.default, { value: query, onChange: menuState == Ui.FilterConfig ? setQuery : () => { } })),
        react_1.default.createElement(ink_1.Box, { display: menuState == Ui.FilterTable ? "flex" : "none" },
            react_1.default.createElement(filter_table_1.default, { filteredEvents: filterBuffer, domains: domainStack.map(d => domains.get(d)), appMenuState: menuState })));
};
module.exports = App;
exports.default = App;
