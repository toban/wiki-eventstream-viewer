import { FC } from 'react';
export interface event {
    domain: string;
    title: string;
    user: string;
    uri: string;
    id: string;
    date: string;
    time: string;
}
export interface domain {
    domain: string;
    title: string;
    numEvents: number;
    eventBuffer: event[];
}
declare const App: FC<{
    name?: string;
}>;
export default App;
