import AddRoadBlocks from "@/components/AddRoadBlocks"
import { Wrench } from "lucide-react"

const Roads = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="topbar flex items-center gap-2 text-2xl font-semibold">
        <Wrench /> Roads
      </div>
      <div className="liveMarkers">

      </div>
      <div className="absolute bottom-15 md:bottom-10 right-5 md:right-10">
          <AddRoadBlocks/>
      </div>
    </div>
  )
}

export default Roads