
import { useEffect, useState } from "react"
import AddRoadBlocks from "@/components/AddRoadBlocks"
import { Wrench, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import UpdateRoadBlockDialog from "@/components/UpdateRoadBlockDialog"

interface RoadBlock {
  _id: string
  name: string
  description?: string
  latitude: number
  longitude: number
  severity: 'Low' | 'Medium' | 'High'
  reportedBy?: string
  timestamp?: string
}

const severityColors: Record<RoadBlock['severity'], string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
}

const Roads = () => {
  const [roadBlocks, setRoadBlocks] = useState<RoadBlock[]>([])
  const [selectedRoadBlock, setSelectedRoadBlock] = useState<RoadBlock | null>(null)

  const fetchRoadBlocks = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/roads`)
      const data = await res.json()
      setRoadBlocks(data)
    } catch (err) {
      console.error("Failed to fetch roadblocks:", err)
    }
  }

  useEffect(() => {
    fetchRoadBlocks()
  }, [])

  const handleShowOnMap = (rb: RoadBlock) => {
    console.log("Show on map:", rb.latitude, rb.longitude)
    // implement your map highlighting logic here 
  }

  return (
    <div className="p-4 md:p-6 relative min-h-screen bg-gray-50">
      <div className="topbar flex items-center gap-2 text-2xl font-semibold mb-6 text-gray-900">
        <Wrench /> Roads
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadBlocks.map((rb) => (
          <Card key={rb._id} className="shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100">
            <CardHeader className="flex justify-between items-start">
              <CardTitle className="text-lg font-bold text-gray-900">{rb.name}</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${severityColors[rb.severity]}`}>
                {rb.severity}
              </span>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700 text-sm">
              <p>{rb.description || 'No description available.'}</p>
              <p><strong>Reported By:</strong> {rb.reportedBy || 'Anonymous'}</p>
              <p><strong>Reported At:</strong> {rb.timestamp ? new Date(rb.timestamp).toLocaleString() : 'N/A'}</p>

              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleShowOnMap(rb)}>
                  <MapPin className="mr-1 h-4 w-4"/> Show on Map
                </Button>
                <Button variant="default" size="sm" onClick={() => setSelectedRoadBlock(rb)}>
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="absolute bottom-20 md:bottom-10 right-5 md:right-10">
        <AddRoadBlocks />
      </div>

      {/* Update Dialog */}
      {selectedRoadBlock && (
        <UpdateRoadBlockDialog
          roadBlock={selectedRoadBlock}
          onClose={() => setSelectedRoadBlock(null)}
          onUpdated={fetchRoadBlocks}
        />
      )}
    </div>
  )
}

export default Roads
