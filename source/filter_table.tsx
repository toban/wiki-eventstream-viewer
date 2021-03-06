import React, {FC} from 'react';
import { Text, Box, useInput, Newline, Spacer } from 'ink';
import open from 'open';
import { domain, event, Ui } from './ui';

const FilterTable = ( props: { 
		filteredEvents: event[] 
		domains: domain[]
		appMenuState: number
	}) => {

	const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

	useInput((input, key) => {

		switch(props.appMenuState) {
			case Ui.FilterTable:
				if (input == 'w') {
					setSelectedIndex(Math.max(0, selectedIndex - 1));
				}
		
				if (input == 's') {
					setSelectedIndex(Math.min(props.filteredEvents.length-1, selectedIndex + 1));
				}
		
				if(key.return) {
		
					const event = props.filteredEvents[selectedIndex];
					if(!event) {
						return
					}
		
					if(event?.uri) {
						open(event.uri);
					}
					
				}
				break;
		}


	},);

	return <Box flexDirection="column">
			<Box flexDirection="column" height={props.filteredEvents.length} width="100%">
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
				props.filteredEvents.map((event, index) => 
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
			<Box flexDirection="column" height={props.domains.length} width="100%">
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
				props.domains.map((
						currentDomain
					) => 
					{

					const lastEvent = currentDomain.eventBuffer[currentDomain.eventBuffer.length - 1];

					return (
					<Box key={currentDomain.domain}>
						<Box width="10%">
							<Text >{currentDomain.domain}</Text>
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

module.exports = FilterTable;
export default FilterTable;
