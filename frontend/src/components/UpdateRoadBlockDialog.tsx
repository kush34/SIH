
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import { Label } from "./ui/label"

<Select defaultValue="Low">
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select severity" />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Severity</SelectLabel>
      <SelectItem value="Low">Low</SelectItem>
      <SelectItem value="Medium">Medium</SelectItem>
      <SelectItem value="High">High</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

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

interface Props {
  roadBlock: RoadBlock
  onClose: () => void
  onUpdated: () => void
}

const UpdateRoadBlockDialog = ({ roadBlock, onClose, onUpdated }: Props) => {
  const [name, setName] = useState(roadBlock.name)
  const [description, setDescription] = useState(roadBlock.description || '')
  const [severity, setSeverity] = useState<RoadBlock['severity']>(roadBlock.severity)

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/roads/${roadBlock._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, severity })
      })
      if (res.ok) {
        onUpdated()
        onClose()
      } else {
        console.error('Update failed')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update RoadBlock</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Severity</Label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as RoadBlock['severity'])}
              className="w-full border rounded-md p-2"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateRoadBlockDialog
