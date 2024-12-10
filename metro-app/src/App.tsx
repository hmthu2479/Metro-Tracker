import './App.css';
import React ,{useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from './Components/Pages/Header';
import { Button } from 'primereact/button';
import TabNavigate from './Components/Pages/TabNavigate';
import TabSearch from './Components/Pages/TabSearch';
import Tabs from './Components/Pages/Tabs';
import 'primeicons/primeicons.css';
        

const routes = [ 
  { index: 1, label: 'Route 1', description: 'Details about Route 1', OpeningHr: '6 AM - 10 PM', price: '$2.00', icon: 'pi pi-bus', busStops: 'Stop A, Stop B' }, 
  { index: 2, label: 'Route 2', description: 'Details about Route 2', OpeningHr: '7 AM - 11 PM', price: '$2.50', icon: 'pi pi-bus', busStops: 'Stop C, Stop D' },  
];
type TabsType ={
  label:string;
  index:number;
  Component: React.FC<any>;
  icon:string;
}[];

const tabs: TabsType =[
  {
    label:"Search",
    index:1 ,
    Component: (props) => (
      <TabSearch
        {...props}
        routes={routes}
        selectedRoute={null}
        onClick={(routeIndex) => {
          console.log(`Route ${routeIndex} clicked`);
        }}
        
      />
    ),
    icon:"pi pi-search"
  },
  {
    label:"Navigate",
    index:2 ,
    Component: TabNavigate,
    icon:"pi pi-map"
  },
];



const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedTab ,setSelectedTab] = useState<number>(tabs[0].index);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  
  const handleRouteClick = (routeIndex: number) => {
    console.log(`Route ${routeIndex} clicked`);
    setSelectedRoute(routeIndex); // Update selectedRoute state
  };

  return (
    <>
      <Header/>
      <div className="container">
        <div className={"sideBar" + (visible ? " showSideBar" : "")}>
          <div className='content'>
            <Tabs 
              selectedTab={selectedTab} 
              onClick={setSelectedTab} 
              tabs={tabs.map((tab) => ({
                ...tab,
                Component: (props) =>
                  tab.index === 1 ? (
                    <TabSearch
                      {...props}
                      routes={routes}
                      selectedRoute={selectedRoute} // Pass selectedRoute
                      onClick={handleRouteClick} // Pass handleRouteClick
                    />
                  ) : (
                    <tab.Component {...props} />
                  ),
              }))}
            />
          </div>
          <Button id="toggle-sidebar-btn" icon= "pi pi-caret-right" onClick={() => setVisible(!visible)}/>
        </div>
        <div className="map">
          <MapContainer center={[10.77510, 106.69831]} zoom={17} scrollWheelZoom={false} style={{ height: "calc(100vh - 69.97px)", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[10.77510, 106.69831]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div> 
    </>
  );
}

export default App;
