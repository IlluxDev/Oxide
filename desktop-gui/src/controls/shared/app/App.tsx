import React from "react";
import Props from "./Props";
import WindowsApp from "../../windows/app/App";
import deepmerge from "deepmerge";

export default React.forwardRef((props: Props, ref) => {
    const defaultSettings = {
        
    } as Props;

    const settings = deepmerge(defaultSettings, props);
    
    return (
        <WindowsApp {...settings} />
    );
});