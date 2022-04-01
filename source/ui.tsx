import React, {FC} from 'react';
import { Text, Box, useInput, Newline, Spacer } from 'ink';
import EventSource from 'eventsource';
import open from 'open';

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

const App: FC<{name?: string}> = () => {

	const bufferSize: number = 10;
	const maxHeight: number = 20;
	const selectedDomain = "en.wikipedia.org";
	const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
	const [domains, setDomains] = React.useState(new Map<string, domain>());
	const [domainStack, setDomainStack] = React.useState<string[]>([]);
	const [filterBuffer, setFilterBuffer] = React.useState<event[]>([]);
	const [socket, setSocket] = React.useState<EventSource>();

	React.useEffect(() => {
		const newSocket = new EventSource( 'https://stream.wikimedia.org/v2/stream/recentchange' );
		setSocket(newSocket);
		newSocket.onmessage = onMessage;
		return () => newSocket.close();
	}, []);

	useInput((input, key) => {

		if( input == 'q' ) {
			console.log('should exit');
		}

		if (input == 'w') {
			setSelectedIndex(Math.max(0, selectedIndex - 1));
		}

		if (input == 's') {
			setSelectedIndex(Math.min(filterBuffer.length-1, selectedIndex + 1));
		}

		if(key.return) {

			const event = filterBuffer[selectedIndex];
			if(!event) {
				return
			}

			if(event?.uri) {
				open(event.uri);
			}
			
		}

	},);

	const onMessage = function (event: MessageEvent) {

		if( event.type == 'message' ) {
			const parsedData = JSON.parse(event.data);
			const domain = parsedData.meta.domain;

			var filterstrings = ['ukraine','russia'];
			var regex = new RegExp( filterstrings.join( "|" ), "i");
			
			if(regex.test(event.data)) {
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
				return [parsedData.meta.domain, ...prevStack.filter(x=> x !== parsedData.meta.domain && x !== selectedDomain)].slice(0, maxHeight)
			})

			// setData(previousData => [
			// 	...previousData,
			// 	{
			// 		domain: domain,
			// 		title: parsedData.title
			// 	}
			// ]);
		}
	}

	return <Box flexDirection="column">
			<Box>
				<Text color="green">{ socket?.readyState == 1 ? "✅" : "❌" }</Text>
			</Box>
			<Box flexDirection="column" height={filterBuffer.length} width="100%">
				<Box>
					<Box width="10%">
						<Text bold>Domain</Text>
					</Box>
					
					<Box width="10%">
						<Text bold>Time</Text>
					</Box>

					<Box width="10%">
						<Text bold>User</Text>
					</Box>

					<Box width="70%">
						<Text bold>Title</Text>
					</Box>
				</Box>
			{
				/* [...domains.keys()] */
				filterBuffer.map((event, index) => 
				{
					const selected = index == selectedIndex;
					const rowColor = selected ? "yellow" : "white";

					return (
					<Box key={event.id}>
						<Box width="10%">
							<Text color={rowColor}>{event.domain}</Text>
						</Box>
		
						<Box width="10%">
							<Text color={rowColor}>{event.time}</Text>
						</Box>

						<Box width="10%">
							<Text color={rowColor}>{event.user}</Text>
						</Box>
		
						<Box width="70%">
							<Text color={rowColor}>{event.title}</Text>
						</Box>
					</Box>
					)
					}
				)
			}
			</Box>

			<Newline />
			<Box flexDirection="column" height={domainStack.length} width="100%">
				<Box>
					<Box width="10%">
						<Text bold>Domain</Text>
					</Box>

					<Box width="10%">
						<Text bold>Events</Text>
					</Box>

					<Box width="10%">
						<Text bold>Last user</Text>
					</Box>

					<Box width="70%">
						<Text bold>Last title</Text>
					</Box>
				</Box>
			{
				/* [...domains.keys()] */
				domainStack.map((domain) => 
					{
					const currentDomain = domains.get(domain);

					if(!currentDomain) {
						return;
					}

					const lastEvent = currentDomain.eventBuffer[currentDomain.eventBuffer.length - 1];

					return (
					<Box key={domain}>
						<Box width="10%">
							<Text >{domain}</Text>
						</Box>
		
						<Box width="10%">
							<Text>{currentDomain.numEvents}</Text>
						</Box>

						<Box width="10%">
							<Text>{lastEvent?.user}</Text>
						</Box>
		
						<Box width="70%">
							<Text>{lastEvent?.title}</Text>
						</Box>
					</Box>
					)
					}
				)
			}
			</Box>
			</Box>

			
};

		/* <Text color="green">{ data.length > 0 ? data[data.length-1]?.domain : "nothing" }</Text>
			<Text color="yellow">{ data.length > 0 ? data[data.length-1]?.title : "nothing" }</Text> */

module.exports = App;
export default App;
