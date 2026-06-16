import { getLastSeeded } from "@/lib/getLastSeeded";
import ChatContainer from "@/components/ChatContainer";

export default async function Home() {
  const lastSeeded = await getLastSeeded();
  return <ChatContainer lastSeeded={lastSeeded} />;
}