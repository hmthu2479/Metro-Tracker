import { useState, useEffect } from "react";
import axios from "axios";
import metroIcon from '../../assets/logo.png'
import busIcon from '../../assets/bus-icon.png'


const fetchDataFromAPI = async (query: string) => {
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url);
    return response.data.elements;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const useFetchRouteData = (selectedRoute: number | null) => {
  const [Stops, setStops] = useState<any[]>([]);
  const [Routes, setRoutes] = useState<any[]>([]);
  const [RoutePaths, setRoutePaths] = useState<any[]>([]);
  const [center, setCenter] = useState<[number,number]>([10.7708271, 106.6975358]);

  
    useEffect(() =>{
      //south_latitude, west_longitude, north_latitude, east_longitude
      // const bbox = "10.74073,106.63871,10.78711,106.72042";
      const bbox = `9.877,105.548,11.361,108.163`;
      const queryRoute = `
      [out:json];
      (
        relation["route"="bus"](${bbox});
        relation["route"="subway"](${bbox});
      );
      out body;
      `;
      fetchDataFromAPI(queryRoute).then((data) => {
        const forwardRoutes : any[] = [];
        data.forEach((route:any) =>{
          if(route.tags && route.tags.ref && !forwardRoutes.some((existingRoute:any) => existingRoute.tags.ref === route.tags.ref )){
            forwardRoutes.push(route);
            // console.log("forwardRoutes:",forwardRoutes);
          }
        })
        setRoutes(forwardRoutes)
      });
    },[]);
    
    const routes = Routes.map((route) => ({
      index: route.id,
      label: route.tags && (route.tags.route === "bus" ? "Route " + route.tags.ref : "Route Metro " + route.tags.ref) || "Unnamed Route",
      OpeningHr: route.tags && route.tags.opening_hours || "Unknown Hours",
      price: route.tags && route.tags.charge || "Free",
      icon: route.tags && route.tags.route === "bus" ? busIcon : metroIcon,
      stops:route.tags &&  route.tags.from + " - " + route.tags.to,
    }));


    useEffect (() =>{
      if (!selectedRoute) return;
      const relationId = `${selectedRoute}`

        const queryRoutePath = `
        [out:json];
        relation(${relationId});
        (._;>;);
        way(r);
        out geom;
        `;
  
        const queryStops = `
        [out:json];
        relation(${relationId});
        node(r)["highway"="bus_stop"];
        out body;
        `;
        fetchDataFromAPI(queryStops).then(setStops);

        const fetchEntryStop = async(relationId:string): Promise<[number, number] | null | undefined> =>{
          const url = `https://www.openstreetmap.org/api/0.6/relation/${relationId}`;
          try{
            const response = await axios.get(url);
            // Parse the relation members
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data, "text/xml");
            const members = Array.from(xmlDoc.getElementsByTagName("member"));
            const entryPoint = members.find((member) => member.getAttribute("role") === "platform_entry_only");
    
            if(entryPoint){
              const ref = entryPoint.getAttribute("ref");
              const nodeUrl = `https://www.openstreetmap.org/api/0.6/node/${ref}`;
              try{
                const nodeResponse = await axios.get(nodeUrl);
                const parser = new DOMParser();
                const nodeXmlDoc = parser.parseFromString(nodeResponse.data, "text/xml");
                const node = nodeXmlDoc.getElementsByTagName("node")[0];
                console.log("node",node);
                const latNode = node.getAttribute("lat");
                const lonNode = node.getAttribute("lon");
                if(latNode && lonNode){return [parseFloat(latNode), parseFloat(lonNode)]};
                }catch(error){
                  console.error("Error fetching data:", error);
                  return null;
                }
            }
          } catch(error){
            console.error("Error fetching data:", error);
            return null;
          }
        };

        fetchEntryStop(relationId).then((entryCoord) => {
          entryCoord && setCenter(entryCoord)
          console.log("entryCoord",entryCoord);
        });
    
        fetchDataFromAPI(queryRoutePath).then((data)=> {
          const areConnected = (way1:any, way2:any) =>{
            const end1 = way1.geometry[way1.geometry.length - 1 ];
            const start2 = way2.geometry[0];
            return end1.lat === start2.lat && end1.lon === start2.lon;
          }
          const visited = new Set();
          const sortedWays:any[]= [];
          data.forEach((fisrtWay:any,index:number)=>{
            if(visited.has(index))return;
            visited.add(index);
            const path = [...fisrtWay.geometry];
    
            data.forEach((seacondWay:any,secondIndex:number)=>{
              if(visited.has(index))return;
              if(areConnected(fisrtWay,seacondWay)){
                visited.add(secondIndex);
                path.push(...seacondWay.geometry.slice(1)); //Adds all remaining points of seacondWay to the path array.
                fisrtWay = seacondWay;
              }
            })
            sortedWays.push(path); 
          }) 
    
          const routePath = sortedWays.map((path:any)=> 
            path.map((point:any)=>[point.lat, point.lon])
    
          );
          setRoutePaths(routePath);
        });
    },[selectedRoute])

    return { routes, Stops, RoutePaths, center };

}
export default useFetchRouteData;