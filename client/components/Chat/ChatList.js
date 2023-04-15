import ChatElement from "./ChatElement";
function ChatList({ messages }) {
  if (messages.length === 0) return <h1>Start chatting</h1>;
  return (
    <div className="">
      {messages.map((m) => (
        <ChatElement key={Math.random()} information={m} />
      ))}
    </div>
  );
}

export default ChatList;
