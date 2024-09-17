import { useState, useRef, useEffect } from "react";
import ChatMessage from "./chatMessage";
import LoadingComponent from "./loadingComponent";
import { useAccount } from "wagmi";

interface ChatMessage {
  question?: string;
  response?: string;
}

interface ResponseObject {
  question: string;
  response: string;
  imageUrl?: string;
  id: string;
}

interface ChatMessageProps {
  responses?: ResponseObject[];
  showChat: boolean;
  setShowChat: (showChat: boolean) => void;
}

export default function Chatbox({ showChat, setShowChat }: ChatMessageProps) {
  const [message, setMessage] = useState<string>("");
  const [responses, setResponses] = useState<ResponseObject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const [users, setUsers] = useState<any[]>([]);
  const [isUserValid, setIsUserValid] = useState<boolean>(false);
  const getUsers = async () => {
    const response = await fetch("/api/getUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Data", data);
    setUsers(data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log("Users", users);
    if (address) {
      const user = findAddress(address as string);
      console.log("User", user);
      //Check if user is there first
      if (user) {
        console.log(user.valid);
        if (user.valid === true) {
          setIsUserValid(true);
        } else {
          setIsUserValid(false);
        }
      }
    }
  }, [users]);

  useEffect(() => {
    console.log("Is User Valid", isUserValid);
  }, [isUserValid]);

  const findAddress = (address: string) => {
    const user = users.find(
      (user) => user.address.toLowerCase() === address.toLowerCase()
    );
    return user;
  };

  //Dealing with the responses
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "exit()") {
    }



    if (!message.trim()) {
      console.error("Message is empty. Please enter a message.");
      return;
    }

    if(isUserValid === false){
      window.alert("You are not a valid user, please donate to become a valid user")
      return;
    }

    setIsLoading(true);

    const newResponse: ResponseObject = {
      question: message,
      response: "",
      id: Date.now().toString(),
    };

    setResponses((responses) => [...responses, newResponse]);

    setMessage("");

    console.log("Message", message);
    try {
      const response = await fetch("/api/chatBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      setIsLoading(false);
      const data = await response.json();

      setResponses((prevResponses) =>
        prevResponses.map((resp) => {
          if (resp.question === message) {
            return { ...resp, response: data.message, id: data };
          }
          return resp;
        })
      );
      console.log("Data", data);
    } catch (error) {
      console.error("ErFor fetching response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, [message]);

  useEffect(() => {
    console.log("Responses", responses);
  }, [responses]);

  return (
    <div className="fixed z-20  h-full bottom-0 bg-black/50 top-0 left-0 right-0 flex flex-col items-center justify-center py-[1rem] ">
      <div className="flex flex-row gap-[10px]">
        <div
          onClick={() => setShowChat(false)}
          className="banner-tag cursor-pointer text-[12px] sm:text-[14px] !w-[150px]"
        >
          CLOSE TERMINAL
        </div>
      </div>

      <div className="container-box h-[400px] overflow-scroll relative border-dashed w-[400px] formbox">
      <form
          onSubmit={handleSubmit}
          className="flex h-full relative  flex-col gap-[2px] text-[14px]"
        >
          {responses?.map((response, index) => (
            <div key={index}>
              <div className="user-message p-[1rem] ">
                <div className="user-message-content">
                  {/* <div className="user-message-text"> $wave ~ {response.question}</div> */}
                  <div className="user-message-text text-[12px]">
                    {`particle~${response.question}`}
                  </div>
                </div>
              </div>

              <div className="bot-message p-[1rem] justify-end text-[14px]">
                <div className="bot-message-content">
                  {response.response ? (
                    <ChatMessage response={response as any} />
                  ) : (
                    <LoadingComponent />
                    // isFetchLoading && <LoadingComponent /> // Render LoadingComponent while waiting for response
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center w-full justify-center relative p-[1rem]">
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="type your message here travler"
              className="w-full text-[10px] outline-none bg-transparent "
            />
          </div>
          {/* <button
              type="submit"
              className="fixed submitBtn  text-white p-[1rem] rounded-md"
            >
              Send
            </button> */}
        </form>
      </div>
    </div>
  );
}
