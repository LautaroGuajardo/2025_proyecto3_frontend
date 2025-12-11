import { Card } from "@/components/ui/card";

export default function Chat() {
  return (
    <div className="flex-row">
      <div className="h-full">
        <Card className="h-full">
          <h2 className="text-2xl font-bold mb-4">Chat</h2>
          <p>This is where the chat interface will be implemented.</p>
        </Card>
      </div>


      <div>
        <Card className="w-full">
          <h2 className="text-2xl font-bold mb-4">Chat Instructions</h2>
        </Card>
      </div>
    </div>
  );
}