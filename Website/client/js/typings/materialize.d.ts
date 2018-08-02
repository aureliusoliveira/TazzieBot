// Type definitions for Bootstrap 3.3.5
// Project: http://materializecss.com/
// Definitions by: Kristof Torfs <https://github.com/kristoftorfs/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface SideNavOptions {
    menuWidth?: number;
    edge?: string;
    closeOnClick?: boolean;
}

interface JQuery {
    sideNav(options?: SideNavOptions): JQuery;
    sideNav(command: string): JQuery;
}

declare module "materialize" {
}