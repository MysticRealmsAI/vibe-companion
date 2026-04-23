import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/contexts/UserContext";

interface Props {
  message: ChatMessage;
}

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "gradient-primary text-primary-foreground rounded-2xl rounded-br-md"
            : "bg-card text-card-foreground rounded-2xl rounded-bl-md"
        }`}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
