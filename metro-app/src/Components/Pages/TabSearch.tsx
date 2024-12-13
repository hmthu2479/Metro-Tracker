import React, { FC, Fragment, useEffect, useState } from "react";
import RouteHeaderTabs from './TabSearch/RouteHeaderTabs';
import Timeline from '../Pages/TabSearch/RouteHeaderTabs/Timeline';
import Infomation from '../Pages/TabSearch/RouteHeaderTabs/Infomation';
import Station from '../Pages/TabSearch/RouteHeaderTabs/Station';
import Rating from '../Pages/TabSearch/RouteHeaderTabs/Rating';
import { InputText } from "primereact/inputtext";
import 'primeicons/primeicons.css';
import "../Style/Routes.scss"

type Route = {
  index: number;
  label: string;
  OpeningHr: string;
  price: string;
  icon: string;
  busStops: string;
};

type RouteHeaderTabsType ={
  label:string;
  index:number;
  Component: React.FC<any>;
}[];


type RoutesProps = {
  routes: Route[]; // Array of Route objects
  selectedRoute?: number | null;
  onClick: (index: number) => void; // Function to handle route clicks
  className?: string;
};

const routeHeaderTabs : RouteHeaderTabsType = [
  {
    label:"Timeline",
    index:1 ,
    Component:Timeline
  },
  {
    label:"Station",
    index:2 ,
    Component:Station
  },
  {
    label:"Infomation",
    index:3 ,
    Component:Infomation
  },
  {
    label:"Rating",
    index:4 ,
    Component:Rating
  }
];

const TabSearch: FC<RoutesProps> = ({
  className = "routes-component",
  routes = [],
  selectedRoute = null,
  onClick,
}) => {
  const routeInfo = routes.find((route) => route.index === selectedRoute);
  const [showDetails, setShowDetails] = useState(false);
  const [forward, setforward] = useState(true);
  const [selectedTab ,setSelectedTab] = useState<number>(routeHeaderTabs[1].index);

  const handleRouteClick = (index: number) => {
    if (selectedRoute === index && !showDetails) {
      setShowDetails(true);
    } else {
      // Clicking a new route or toggling to another
      onClick(index);
    }
  };

  useEffect(()=>{
    if (selectedRoute !== null) {
      setShowDetails(true);
    }
  },[selectedRoute])
  
  console.log("showDetails:", showDetails, "routeInfo:", routeInfo);
  return (
    <Fragment>
      {showDetails && routeInfo ? (
        <div
          role="routepanel"
          aria-labelledby={`btn-${selectedRoute}`}
          id={`routepanel-${selectedRoute}`}
        >
          <div className="route-header">
            <button type="button" role="button" onClick={() => setShowDetails(false)}>
              <i className="pi pi-arrow-circle-left"></i>
            </button>
            <h2>{routeInfo.label}</h2>
          </div>
          <div className="directions">
            <button type="button" role="forwardBtn" className={forward === true ? "active" : ""}> Forward</button>
            <button type="button" role="backwardBtn" className={forward === false ? "active" : ""}> Backward</button>
          </div>
          <RouteHeaderTabs 
              selectedHeaderTab={selectedTab} 
              onClick={setSelectedTab} 
              headerTabs={routeHeaderTabs}
            />
        </div>
      ) : (
        <div className={className}>
          <InputText placeholder="Search" id="sideBarSearchBar" />
          <div role="routelist">
            {routes.length > 0 ? (
              routes.map((route) => (
                <button
                  className={selectedRoute === route.index ? "active" : ""}
                  onClick={() => {
                    handleRouteClick(route.index);
                  }}
                  key={route.index}
                  type="button"
                  role="route"
                  aria-selected={selectedRoute === route.index}
                  aria-controls={`routepanel-${route.index}`}
                  tabIndex={selectedRoute === route.index ? 0 : -1}
                  id={`btn-${route.index}`}
                >
                  {typeof route.icon === 'string' && route.icon.includes('/') ? (
                    <img src={route.icon} alt={`${route.label} icon`} id="route-icon"/>
                  ) 
                  : (
                    <i className={route.icon} style={{ marginRight: "10px" }}></i>
                  )}
                  
                  <div className="right-section">
                    <h2>{route.label}</h2>
                    <p>{route.busStops}</p>
                    <div className="sub-info">
                      <div>
                        <i className="pi pi-clock" style={{ marginRight: "8px", fontSize:"15px" }}></i>
                        {route.OpeningHr}
                      </div>
                      <div>
                        <i className="pi pi-dollar" style={{ marginRight: "8px" , fontSize:"15px"}}></i>
                        {route.price}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p>No routes available.</p>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default TabSearch;
