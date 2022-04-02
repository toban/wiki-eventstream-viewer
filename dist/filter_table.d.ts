import { domain, filteredEvent } from './ui';
declare const FilterTable: (props: {
    filteredEvents: filteredEvent[];
    domains: domain[];
    appMenuState: number;
}) => JSX.Element;
export default FilterTable;
