import { GoogleMap, Marker} from "react-google-maps";
import { LoadScript } from "@react-google-maps/api";

function Map() {
    const mapStyles = {        
      height: "100vh",
      width: "100%"};
    
    const defaultCenter = {
      lat: 41.3851, lng: 2.1734
    }
    
    return (
       <LoadScript
         googleMapsApiKey='YOUR_GOOGLE_MAPS_API_KEY'>
         <GoogleMap
           mapContainerStyle={mapStyles}
           zoom={13}
           center={defaultCenter}>
           <Marker position={defaultCenter}/>
         </GoogleMap>
       </LoadScript>
    )
  }
export default Map;
