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
	time: string,
	stream: string
}

export interface filteredEvent extends event{
	matches: string[]
}

export interface domain {
	domain: string
	title: string
	numEvents: number
	lastEvent: event
	//eventBuffer: event[]
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
	
	const [numEvents, setNumEvents] = React.useState<number>(0);
	const [numFilteredEvents, setNumFilteredEvents] = React.useState<number>(0);

	const [domains, setDomains] = React.useState(new Map<string, domain>());
	const [domainStack, setDomainStack] = React.useState<string[]>([]);
	const [filterBuffer, setFilterBuffer] = React.useState<filteredEvent[]>([]);
	
	const [menuState, setMenuState] = React.useState<number>(Ui.FilterConfig);
	const [query, setQuery] = React.useState('');
	
	const [socket, setSocket] = React.useState<EventSourceSocket>();

	React.useEffect(() => {

		const newSocket = new EventSource( 'https://stream.wikimedia.org/v2/stream/page-create,page-delete,page-links-change,page-move,page-properties-change,page-undelete,recentchange,revision-create,revision-score');
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

	const parseUser = function (data: any): string {
		return data.user ? data.user : data.performer?.user_text 

	}
	const onMessage = function (event: MessageEvent) {

		if( event.type == 'message' ) {
			setNumEvents(prev => prev + 1);
			const parsedData = JSON.parse(event.data);
			const domain = parsedData.meta.domain;
			const user = parseUser(parsedData);
			const uri = parsedData.meta.uri.replace('https://' + domain, '');
			
			if(socket?.filter) {

				//const matches = event.data.match(socket.filter);
				if( socket.filter.test(event.data)) { //matches && matches.length ) {
					setNumFilteredEvents(prev => prev + 1 );
					setFilterBuffer(previousFilterBuffer => [
						{
							domain: domain,
							title: parsedData.title,
							user: user,
							uri: uri,
							id: parsedData.meta.id,
							date: parsedData.meta.dt.slice(0,10),
							time: parsedData.meta.dt.slice(11,19),
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
	}
	return <Box flexDirection="column">
			<Box>
				<Text color="green">{ socket?.socket?.readyState == 1 ? "✅" : "❌" } </Text>
				{/* {socket?.filter?.source} :: {numFilteredEvents}/{numEvents} */}
			</Box>
				<Box display={menuState == Ui.FilterConfig ? "flex" : "none"} borderStyle="classic">
					<Text>Filter: </Text>
					<TextInput value={query} onChange={menuState == Ui.FilterConfig ? setQuery : () => {}} />
				</Box>
				<Box display={menuState == Ui.FilterTable ? "flex" : "none"}>
					<FilterTable filteredEvents={filterBuffer} domains={ domainStack.map( d => domains.get(d)! ) } appMenuState={menuState} />
				</Box>
			</Box>

			
};

module.exports = App;
export default App;
