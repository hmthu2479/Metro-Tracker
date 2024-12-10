import React, { FC, Fragment, useState } from "react";
import { InputText } from "primereact/inputtext";

type Route = {
  index: number;
  label: string;
  description: string;
  OpeningHr: string;
  price: string;
  icon: string;
  busStops: string;
};


type RoutesProps = {
  routes: Route[]; // Array of Route objects
  selectedRoute?: number | null;
  onClick: (index: number) => void; // Function to handle route clicks
  className?: string;
};

const TabSearch: FC<RoutesProps> = ({
  className = "routes-component",
  routes = [],
  selectedRoute = null,
  onClick,
}) => {
  const routeInfo = routes.find((route) => route.index === selectedRoute);
  const [showDetails, setShowDetails] = useState(false);

  const handleRouteClick = (index: number) => {
    console.log("Handling Route Click for Index:", index); // Debugging
    onClick(index);
    setShowDetails(true);
  };

  return (
    <Fragment>
      <InputText placeholder="Search" id="sideBarSearchBar" />
      {showDetails && routeInfo ? (
        <div
          role="routepanel"
          aria-labelledby={`btn-${selectedRoute}`}
          id={`routepanel-${selectedRoute}`}
        >
          <button type="button" role="button" onClick={() => setShowDetails(false)}>
            Back
          </button>
          <div>
            <h2>{routeInfo.label}</h2>
            <p>{routeInfo.description || "No description available."}</p>
          </div>
        </div>
      ) : (
        <div className={className}>
          <div role="routelist">
            {routes.length > 0 ? (
              routes.map((route) => (
                <button
                  className={selectedRoute === route.index ? "active" : ""}
                  onClick={() => {
                    console.log("Clicked Route Index:", route.index); // Debugging
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
                  <i className={route.icon} style={{ marginRight: "10px" }}></i>
                  {route.label}
                  {route.busStops}
                  <div className="sub-info">
                    <i className="pi pi-clock" style={{ marginRight: "10px" }}>
                      {route.OpeningHr}
                    </i>
                    <i className="pi pi-dollar" style={{ marginRight: "10px" }}>
                      {route.price}
                    </i>
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
