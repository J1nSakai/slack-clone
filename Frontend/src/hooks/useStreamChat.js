import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import { useEffect } from "react";
import { StreamChat } from "stream-chat";
import * as Sentry from "@sentry/react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// This hook will be used to connect the user to the Stream Chat API.
// This will let the user send and receive messages in real time.
// This will also let us know if the user is logged into Stream Chat or not.

export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  // fetch stream token using react query

  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!user?.id, // the "!!" take the object, and convert it to boolean
  });

  // init stream chat client
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !user) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: user.id,
          name: user.fullName,
          image: user.imageUrl,
        });
        setChatClient(client);
      } catch (error) {
        console.log("Error connecting to StreamChat:", error);
        Sentry.captureException(error, {
          tags: {
            component: "useStreamChat",
          },
          extra: {
            context: "stream_chat_connection",
            userId: user?.id,
            streamApiKey: STREAM_API_KEY ? "present" : "missing",
          },
        });
      }
    };
    initChat();

    // cleanup
    return () => {
      if (chatClient) chatClient.disconnetUser();
    };
  }, [tokenData, user, chatClient]);

  return { chatClient, isLoading: tokenLoading, error: tokenError };
};
