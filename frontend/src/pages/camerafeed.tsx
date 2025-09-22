import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2 } from "lucide-react";

const Camerafeed = () => {
  return (
    <div className='p-4 md:p-6 flex flex-col gap-5 items-center justify-center w-full h-[80vh]'>

      <div className="flex gap-3 justify-start items-center w-full mt-15">
        <span className="text-zinc-500">
          <Building2 />
        </span>
        <Select>
          <SelectTrigger className="rounded-xl px-5 py-2">
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="rounded-xl  px-5 py-2">
            <SelectValue placeholder="Select Intersection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gandhiCircle">Gandhi Circle</SelectItem>
            <SelectItem value="townhall">Townhall</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2'>
        <img src="http://localhost:5000/video_feed" className='rounded-xl' alt="loading live camera feed..." />
        <img src="http://localhost:5000/video_feed" className='rounded-xl' alt="loading live camera feed..." />
        <img src="http://localhost:5000/video_feed" className='rounded-xl' alt="loading live camera feed..." />
        <img src="http://localhost:5000/video_feed" className='rounded-xl' alt="loading live camera feed..." />
      </div>
    </div>
  )
}

export default Camerafeed