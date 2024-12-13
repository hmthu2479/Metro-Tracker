import React, {FC} from "react";
import "../../Style/Routes.scss"

type RouteHeaderTabsProps = {
    headerTabs:{
        label: string;
        index: number;
        Component: FC<{ index: number}>;
    }[];
    selectedHeaderTab: number;
    onClick: (index: number) => void;
    className?: string;
}

const RouteHeaderTabs: FC<RouteHeaderTabsProps> =({
    className = "route-header-tab",
    headerTabs =[],
    selectedHeaderTab = 1,
    onClick
  }) =>{
      //only attempts to call the find method if tabs is a truthy value (not null or undefined)
      const Panel = headerTabs && headerTabs.find((tab)=> tab.index === selectedHeaderTab);
    return(
        <div className={className}>
        <div role="headertablist">
          {headerTabs.map((tab) =>(
            <button 
              className={selectedHeaderTab === tab.index ? "active" : ""}
              onClick={() => onClick(tab.index)}
              key={tab.index}
              type="button"
              role="header-tab"
              aria-selected={selectedHeaderTab === tab.index}
              aria-controls={`header-tabpanel-${tab.index}`}
              tabIndex={selectedHeaderTab === tab.index ? 0 : -1}
              id={`btn-${tab.index}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div 
          role="header-tabpanel"
          aria-labelledby={`btn-${selectedHeaderTab}`}
          id={`header-tabpanel-${selectedHeaderTab}`}
        >
          {Panel && <Panel.Component index={selectedHeaderTab}/>}
        </div>
      </div>
    );
  };
  export default RouteHeaderTabs;