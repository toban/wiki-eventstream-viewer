#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
//import meow from 'meow';
import App from './ui';
import StreamSelector from './stream_selector';
//import EventSource from 'eventsource';

// const cli = meow(`
// 	Usage
// 	  $ wikimedia-stream-viewer

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ wikimedia-stream-viewer --name=Jane
// 	  Hello, Jane
// `, {
// 	flags: {
// 		name: {
// 			type: 'string'
// 		}
// 	}
// });

const streams = [];

//render(<StreamSelector />);
render(<App />);
