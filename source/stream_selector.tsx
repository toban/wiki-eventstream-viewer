import React, {FC} from 'react';
import { Text, Box, useInput, Newline, Spacer } from 'ink';
import open from 'open';
import { domain, event, filteredEvent, Ui } from './ui';

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
]

export enum menuOption {
	Start = -2,
	All = -1,
}
const StreamSelector = () => {

	const [selectedIndex, setSelectedIndex] = React.useState<number>(menuOption.Start);
	const [selectedStreams, setSelectedStreams] = React.useState<boolean[]>(streams.map(()=> true));

	useInput((input, key) => {
		
		if (input == 'w') {
			setSelectedIndex(Math.max(-2, selectedIndex - 1));
		}

		if (input == 's') {
			setSelectedIndex(Math.min(streams.length-1, selectedIndex + 1));
		}

		if(key.return) {

			if(selectedIndex == menuOption.All) {
				setSelectedStreams(prev => {
					return prev.map((x)=> !x ); 
				});
			} else if(selectedIndex == menuOption.Start) {

			} else {
				setSelectedStreams(prev => {
					prev[selectedIndex] = !prev[selectedIndex];
					return prev; 
				});
			}
		}


	},);

	return <Box flexDirection="column">
			<Box>
				<Box borderStyle="classic" width="3"><Text color={selectedIndex == menuOption.Start ? "yellow" : "white"}>START</Text></Box>
				<Box display={selectedIndex == menuOption.Start ? "flex" : "none"}><Text color={selectedIndex == menuOption.Start ? "yellow" : "white"}> { "\n   <---- Press ENTER to start!" } </Text></Box>
			</Box>
			<Box borderStyle="classic" flexDirection="column">
			<Box flexDirection="column" height={streams.length} width="100%">
				<Box>
					<Box width="5">
						<Text color={selectedIndex == menuOption.All ? "yellow" : "white"} bold>ALL</Text>
					</Box>
					
					<Box>
						<Text color={selectedIndex == menuOption.All ? "yellow" : "white"} bold>Name</Text>
					</Box>
				</Box>
			{
				/* [...domains.keys()] */
				streams.map((stream, index) => 
				{
					const selected = selectedStreams[index];
					const selectedUi = index == selectedIndex;
					const rowColor = selectedUi ? "yellow" : "white";

					return (
					<Box key={stream}>
						<Box width="5">
							<Text color={rowColor}>[{selected ? 'X' : ' '}]</Text>
						</Box>
		
						<Box>
							<Text color={rowColor}>{stream}</Text>
						</Box>
					</Box>
					)
					}
				)
			}
			</Box>

			</Box>

			</Box>

			
};

module.exports = StreamSelector;
export default StreamSelector;
