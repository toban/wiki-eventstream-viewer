import React, {FC} from 'react';
import { Text, Box, useInput, Newline, Spacer } from 'ink';
import open from 'open';
import { domain, event, filteredEvent, Ui } from './ui';

const FilterTable = ( props: { 
		filteredEvents: filteredEvent[] 
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
						open('https://' + event.domain + event.uri );//'&action=history?uselang=en'); // todo select at start
					}
					
				}
				break;
		}


	},);

	return <Box flexDirection="column">
			<Box flexDirection="column" height={props.filteredEvents.length} width="100%">
				<Box>
					<Box width="10">
						<Text bold>Domain</Text>
					</Box>

					<Box width="14">
						<Text bold>Stream</Text>
					</Box>

					<Box width="5">
						<Text bold>Time</Text>
					</Box>

					<Box width="10">
						<Text bold>User</Text>
					</Box>

					<Box width="55">
						<Text bold>Title</Text>
					</Box>

					{/* <Box width="10%">
						<Text bold>Match</Text>
					</Box> */}
				</Box>
			{
				/* [...domains.keys()] */
				props.filteredEvents.map((event, index) => 
				{
					const selected = index == selectedIndex;
					const rowColor = selected ? "yellow" : "white";

					return (
					<Box key={event.time + event.id}>
						<Box width="10%">
							<Text color={rowColor}>{event.domain}</Text>
						</Box>

						<Box width="14">
							<Text color={rowColor}>{event.stream}</Text>
						</Box>
		
						<Box width="5">
							<Text color={rowColor}>{event.time}</Text>
						</Box>

						<Box width="10">
							<Text color={rowColor}>{event.user}</Text>
						</Box>
		
						<Box width="55">
							<Text color={rowColor}>{event.uri}</Text>
						</Box>

						{/* <Box width="10%">
							<Text color={rowColor}>{event.matches}</Text>
						</Box> */}
					</Box>
					)
					}
				)
			}
			</Box>
{/* 
			<Box flexDirection="column" height={props.domains.length} width="100%">
				<Box>
					<Box width="10%">
						<Text bold>Domain</Text>
					</Box>

					<Box width="5%">
						<Text bold>Events</Text>
					</Box>

					<Box width="10%">
						<Text bold>Last user</Text>
					</Box>

					<Box width="75%">
						<Text bold>Last title</Text>
					</Box>
				</Box>
			{
				props.domains.map((
						currentDomain
					) => 
					{

					return (
					<Box key={currentDomain.domain}>
						<Box width="10%">
							<Text >{currentDomain.domain}</Text>
						</Box>
		
						<Box width="5%">
							<Text>{currentDomain.numEvents}</Text>
						</Box>

						<Box width="10%">
							<Text>{currentDomain.lastEvent?.user}</Text>
						</Box>
		
						<Box width="75%">
							<Text>{currentDomain.lastEvent?.title}</Text>
						</Box>
					</Box>
					)
					}
				)
			}
			</Box> */}
			</Box>

			
};

module.exports = FilterTable;
export default FilterTable;
