import { domain, event } from './ui';
declare const FilterTable: (props: {
    filteredEvents: event[];
    domains: domain[];
    appMenuState: number;
}) => JSX.Element;
export default FilterTable;
