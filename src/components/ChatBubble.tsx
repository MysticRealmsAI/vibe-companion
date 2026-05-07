import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export interface BubbleMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  image_url?: string | null;
}

export default function ChatBubble({ message }: { message: BubbleMessage }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed prose prose-sm prose-invert prose-p:my-1 prose-em:text-muted-foreground ${
          isUser
            ? "gradient-primary text-primary-foreground rounded-2xl rounded-br-md"
            : "bg-card text-card-foreground rounded-2xl rounded-bl-md"
        }`}
      >
        {message.image_url && (
          <img src={message.image_url} alt="" className="rounded-xl mb-2 w-full" />
        )}
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
            a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="underline">{children}</a>,
          }}
        >
          {message.content || (isUser ? "" : "...")}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
