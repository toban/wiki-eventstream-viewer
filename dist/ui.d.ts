import { FC } from 'react';
import EventSource from 'eventsource';
export interface event {
    domain: string;
    title: string;
    user: string;
    uri: string;
    id: string;
    date: string;
    time: string;
    stream: string;
}
export interface filteredEvent extends event {
    matches: string[];
}
export interface domain {
    domain: string;
    title: string;
    numEvents: number;
    lastEvent: event;
}
export declare enum Ui {
    FilterConfig = 1,
    FilterTable = 2
}
export interface EventSourceSocket {
    socket: EventSource;
    filter?: RegExp;
}
declare const App: FC<{
    name?: string;
}>;
export default App;
