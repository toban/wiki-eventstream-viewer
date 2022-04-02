import React, {FC} from 'react';
import { Text, Box, useInput, Newline, Spacer } from 'ink';
import EventSource from 'eventsource';
import FilterTable from './filter_table';
import TextInput from 'ink-text-input';
export interface event {
	domain: string
	title: string
	user: string
	uri: string
	id: string
	date: string,
	time: string
}

export interface domain {
	domain: string
	title: string
	numEvents: number
	eventBuffer: event[]
}

export enum Ui {
	FilterConfig = 1,
	FilterTable,
}

export interface EventSourceSocket {
	socket: EventSource
	filter?: RegExp
}

const App: FC<{name?: string}> = () => {

	const bufferSize: number = 10;
	const maxHeight: number = 20;
	const [domains, setDomains] = React.useState(new Map<string, domain>());
	const [domainStack, setDomainStack] = React.useState<string[]>([]);
	const [filterBuffer, setFilterBuffer] = React.useState<event[]>([]);
	
	const [menuState, setMenuState] = React.useState<number>(Ui.FilterConfig);
	const [query, setQuery] = React.useState('');
	
	const [socket, setSocket] = React.useState<EventSourceSocket>();

	React.useEffect(() => {
		const newSocket = new EventSource( 'https://stream.wikimedia.org/v2/stream/recentchange' );
		setSocket({socket: newSocket, filter: undefined});
		newSocket.onmessage = onMessage;
		return () => newSocket.close();
	}, []);

	useInput((input, key) => {
		
		switch(menuState) {
			case Ui.FilterConfig:
				if(key.return) {

					const filterElements = query.split(',');
					if(filterElements.length > 0) {
						var filterString = filterElements.map(x=> x.trim()).join( "|" );
						setSocket(prevSocket => {
							if(prevSocket) {
								prevSocket.filter = new RegExp(filterString, "i");
								prevSocket.socket.onmessage = onMessage;
							}
							return prevSocket
						})
						setMenuState(Ui.FilterTable);
					}
				}
				break;
			case Ui.FilterTable:

				if(key.escape) {
					setFilterBuffer([]);
					setMenuState(Ui.FilterConfig);
				}

				break;
		}


		if(input == 'q') {
			
		}


	},);

	const onMessage = function (event: MessageEvent) {

		if( event.type == 'message' ) {
			const parsedData = JSON.parse(event.data);
			const domain = parsedData.meta.domain;
			
			if(socket?.filter) {

				if(socket.filter.test(event.data)) {
					setFilterBuffer(previousFilterBuffer => [
						{
							domain: domain,
							title: parsedData.title,
							user: parsedData.user,
							uri: parsedData.meta.uri,
							id: parsedData.meta.id,
							date: parsedData.meta.dt.slice(0,10),
							time: parsedData.meta.dt.slice(11,19)
						},
						...previousFilterBuffer
					].slice(0, maxHeight));
				}
			}

			setDomains(previousDomains => {
				var currentDomain = previousDomains.get(domain);

				if( !currentDomain ) {
					currentDomain = {domain: domain, title: "asdf", numEvents: 0, eventBuffer: []}
				}

				if( currentDomain.eventBuffer.length >= bufferSize ) {
					currentDomain.eventBuffer.pop();
				}

				currentDomain.eventBuffer.push(
					{
						domain: domain,
						title: parsedData.title,
						user: parsedData.user,
						uri: parsedData.meta.uri,
						id: parsedData.meta.id,
						date: parsedData.meta.dt.slice(0,10),
						time: parsedData.meta.dt.slice(11,19)
					}
				)

				currentDomain.numEvents+=1;

				return new Map<string, domain>(previousDomains).set(domain, currentDomain)
			});
				
			setDomainStack( prevStack => {
				return [parsedData.meta.domain, ...prevStack.filter(x=> x !== parsedData.meta.domain)].slice(0, maxHeight)
			})
		}
	}
	return <Box flexDirection="column">
			<Box>
				<Text color="green">{ socket?.socket?.readyState == 1 ? "✅" : "❌" } {socket?.filter?.source}</Text>
			</Box>
				<Box display={menuState == Ui.FilterConfig ? "flex" : "none"} borderStyle="classic">
					<Text>Filter: </Text>
					<TextInput value={query} onChange={setQuery} />
				</Box>
				<Box display={menuState == Ui.FilterTable ? "flex" : "none"}>
					<FilterTable filteredEvents={filterBuffer} domains={ domainStack.map( d => domains.get(d)! ) } appMenuState={menuState} />
				</Box>
			</Box>

			
};

module.exports = App;
export default App;
