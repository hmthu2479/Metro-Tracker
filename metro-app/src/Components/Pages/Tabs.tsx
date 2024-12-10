import React, {FC} from "react";
import "../Style/Tabs.css"
        

//Define data type for props of Tabs Components
type TabsProps = {
    tabs:{
        label: string;
        index: number;
        Component: FC<{ index: number}>;
        icon: string;
    }[];
    selectedTab: number;
    onClick: (index: number) => void;
    className?: string;
}
/**
 * Avalible Props
 * @param className string
 * @param tabs Array of object
 * @param selectedTab number
 * @param onClick Function to set the active tab
 */

const Tabs: FC<TabsProps> =({
  className = "tabs-component",
  tabs =[],
  selectedTab = 0,
  onClick
}) =>{
    //only attempts to call the find method if tabs is a truthy value (not null or undefined)
    const Panel = tabs && tabs.find((tab)=> tab.index === selectedTab);
  return(
      <div className={className}>
      <div role="tablist">
        {tabs.map((tab) =>(
          <button 
            className={selectedTab === tab.index ? "active" : ""}
            onClick={() => onClick(tab.index)}
            key={tab.index}
            type="button"
            role="tab"
            aria-selected={selectedTab === tab.index}
            aria-controls={`tabpanel-${tab.index}`}
            tabIndex={selectedTab === tab.index ? 0 : -1}
            id={`btn-${tab.index}`}
          >
            <i className={tab.icon} style={{ marginRight: '10px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>
      <div 
        role="tabpanel"
        aria-labelledby={`btn-${selectedTab}`}
        id={`tabpanel-${selectedTab}`}
      >
        {Panel && <Panel.Component index={selectedTab}/>}
      </div>
    </div>
  );
};
export default Tabs;