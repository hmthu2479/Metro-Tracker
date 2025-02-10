import './App.css';
import React ,{useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Popup,Polyline ,useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from './Components/Pages/Header';
import { Button } from 'primereact/button';
import TabNavigate from './Components/Pages/TabNavigate';
import TabSearch from './Components/Pages/TabSearch';
import Tabs from './Components/Pages/Tabs';
import 'primeicons/primeicons.css';
import useFetchRouteData from './Components/Hooks/useFetchRouteData';

        
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
        selectedRoute={null}       
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
const UpdateMapCenter = ({center}:{center: [number,number]}) =>{
  const map = useMap();
  useEffect(()=>{
    if(center){
      map.flyTo(center,16);
    }
  },[center,map]);
  return null; // This component doesn't render anything, just interacts with the map instance
}


const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedTab ,setSelectedTab] = useState<number>(tabs[0].index);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

  const { routes, Stops, RoutePaths, center } = useFetchRouteData(selectedRoute);
  
  const handleRouteClick = (routeIndex: number) => {
    console.log(`Route ${routeIndex} clicked`);
    setSelectedRoute(routeIndex);
  };

  useEffect(()=>{
    <MapContainer></MapContainer>
  },[setVisible])
  

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
                      selectedRoute={selectedRoute}
                      onClick={handleRouteClick} 
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
          <MapContainer 
          center={center} zoom={16} scrollWheelZoom={true} style={{ height: "calc(100vh - 69.97px)", width: "100%" }}>
            <UpdateMapCenter center={center}/>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {Stops.map((Stop) =>(
              <Marker key={Stop.id} position={[Stop.lat, Stop.lon]}>
                <Popup>
                  {Stop.tags.name || "Unnamed Stop"}
                </Popup>
              </Marker>
            ))}      

              <Polyline 
                positions={RoutePaths} 
                color="#54C069" 
                weight={5} 
              />
              
          </MapContainer>
        </div>
      </div> 
    </>
  );
}

export default App;
