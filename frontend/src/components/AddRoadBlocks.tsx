import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus } from 'lucide-react';
import type { RoadBlock } from '@/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { APIProvider, Map, type MapMouseEvent } from '@vis.gl/react-google-maps';
import axios from 'axios';

const initialState: RoadBlock = {
  name: '',
  description: '',
  latitude: 0,
  longitude: 0,
  severity: 'Low',
};
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS;

const AddRoadBlocks = () => {
  const [roadBlock, setRoadBlock] = useState<RoadBlock>(initialState);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleChange = (field: keyof RoadBlock, value: any) => {
    setRoadBlock(prev => ({ ...prev, [field]: value }));
  };

  const handleMapClick = (event: MapMouseEvent) => {
    if(!event.detail.latLng) return;``
    const { lat, lng } = event.detail.latLng;
    setMarkerPosition({ lat, lng });
    handleChange('latitude', lat);
    handleChange('longitude', lng);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/add-road-work', roadBlock);
      console.log('RoadBlock submitted:', roadBlock);
      setRoadBlock(initialState);
      setMarkerPosition(null);
    } catch (error) {
      console.error('Error submitting roadblock:', error);
    }
  };

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
    <Dialog>
      <DialogTrigger>
        <Button>
          <Plus size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Road Blocks</DialogTitle>
          <DialogDescription>
            Add road blocks on the map to let citizens know about it and plan their route accordingly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="flex flex-col gap-3 w-1/2">
            <Input
              type="text"
              placeholder="Road Block Name"
              value={roadBlock.name}
              onChange={e => handleChange('name', e.target.value)}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={roadBlock.description}
              onChange={e => handleChange('description', e.target.value)}
              className="border p-2 rounded resize-none"
            />
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Latitude"
                value={roadBlock.latitude}
                onChange={e => handleChange('latitude', parseFloat(e.target.value))}
                className="border p-2 rounded"
                step="any"
              />
              <Input
                type="number"
                placeholder="Longitude"
                value={roadBlock.longitude}
                onChange={e => handleChange('longitude', parseFloat(e.target.value))}
                className="border p-2 rounded"
                step="any"
              />
            </div>
            <select
              value={roadBlock.severity}
              onChange={e => handleChange('severity', e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white p-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>

          <div className="w-1/2 h-96">
            <Map
              style={{ width: '100%', height: '100%' }}
              onClick={handleMapClick}
            >
              {markerPosition && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${markerPosition.lat}px`,
                    left: `${markerPosition.lng}px`,
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                  }}
                />
              )}
            </Map>
            <p className="text-sm text-gray-600 mt-2">Click on map to place marker</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </APIProvider>
  );
};

export default AddRoadBlocks;
