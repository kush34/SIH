import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS;

const Dashboard = () => {
  const position = {lat: 20.593684, lng: 78.96288};
  return (
    <APIProvider apiKey={API_KEY}>
      <Map defaultCenter={position} defaultZoom={10} mapId="DEMO_MAP_ID">
        <AdvancedMarker position={position} />
      </Map>
    </APIProvider>
  )
}

export default Dashboard