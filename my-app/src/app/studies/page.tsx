"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  useAccount,
  useBalance,
  useSendTransaction,
  usePrepareTransactionRequest,
  useSignMessage,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useConnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { ethers, parseEther } from "ethers";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import format from "date-fns/format";

export default function Home() {
  const { isConnected, address } = useAccount();
  const [connectedAddress, setConnectedAddress] = useState<string | undefined>(
    undefined
  );
  const { connectors, connect, data } = useConnect();
  const { open } = useWeb3Modal();
  const transactionFee = 0.1;

  const handleConnect = () => {
    open();
  };

  const [recipient, setRecipient] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );

  //Fetch the balance of connect user
  // Fetch the balance of the connected user
  const {
    data: balanceData,
    isError,
    isLoading,
  } = useBalance({
    address,
  });

  // This useEffect will trigger when the balanceData changes
  const [currentBal, setCurrentBal] = useState<string>("");
  useEffect(() => {
    if (balanceData) {
      // console.log("Balance inside useEffect:", balanceData.formatted);
      // console.log(
      //   "Balance inside useEFfect parsed:",
      //   parseEther(balanceData.formatted)
      // );
      const balanceDataBefore = parseFloat(balanceData.formatted); // Use parseFloat for decimal values
      const adjustedBalance = balanceDataBefore * transactionFee; // Subtract transaction fee
      const adjustedBalanceString = adjustedBalance.toString(); // Convert back to string

      // console.log("Logigng ajdust", adjustedBalance);
      // console.log("Logign parse either", balanceData.formatted);
      setCurrentBal(adjustedBalanceString);
    } else {
      // console.log("Balance is not available yet inside useEffect");
    }
  }, [balanceData]); // Ensure useEffect runs when balanceData is updated

  useEffect(() => {
    // console.log("Logging the current bal", currentBal);
  }, [currentBal]);

  const { sendTransaction } = useSendTransaction();

  //Obect containg personal informaiton
  const personalInfo = {
    NAME: "SYDNEY SANDERS",
    LOCATION: "WASHINGTON D.C.",
    CURRENTLY: "CONTACTOR",
    POSITION: "FOUNDER, SOFTWARE ENGINEERING",
  };

  const [showCommandPopup, setShowCommandPopup] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const handleTextareaChange = () => {
    if(typeof window !== 'undefined'){
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(contentEditableRef.current!);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      setCursorPosition(preCaretRange.toString().length);
    }

    }
    const content = contentEditableRef.current?.innerHTML || "";
    if (content.endsWith("/")) {
      setShowCommandPopup(true);
    } else {
      setShowCommandPopup(false);
    }
  };

  const insertTextAtCursor = (fontSize: string) => {

    if(typeof window !== 'undefined'){
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const span = document.createElement("span");
      span.style.fontSize = fontSize;
      span.innerHTML = "&nbsp;";

      range.insertNode(span);
      range.collapse(false);

      selection.removeAllRanges();
      selection.addRange(range);
    }
    setShowCommandPopup(false);
    contentEditableRef.current?.focus();
  }
  };

  const handleCommandClick = (command: string) => {
    switch (command) {
      case "paragraph":
        insertTextAtCursor("14px");
        break;
      case "header1":
        insertTextAtCursor("24px");
        break;
      case "header2":
        insertTextAtCursor("20px");
        break;
    }
  };

  const [articleContent, setArticleContent] = useState("");
  const [articles, setArticles] = useState<
    Array<{ content: string; timestamp: Date; upvotes: number }>
  >([]);

  const handleUpvote = (index: number) => {
    setArticles((prevArticles) =>
      prevArticles.map((article, i) =>
        i === index
          ? { ...article, upvotes: (article.upvotes || 0) + 1 }
          : article
      )
    );
  };

  const handleDonate = (address: string) => {
    // Implement donation logic here
    console.log(`Donating to address: ${address}`);
  };

  const handleUpdateArticle = () => {
    const content = contentEditableRef.current?.innerHTML || "";
    const textContent = content.replace(/<[^>]*>/g, "").trim(); // Remove HTML tags and trim

    const hasImage = content.includes("<img");

    if (textContent.length < 4 && !hasImage) {
      alert("Your post must contain at least 5 characters or an image.");
      return;
    }

    const newArticle = {
      content: contentEditableRef.current?.innerHTML || "",
      timestamp: new Date(),
      upvotes: 0,
    };
    setArticles((prevArticles) => [...prevArticles, newArticle]);
    if (contentEditableRef.current) contentEditableRef.current.innerHTML = "";
  };
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.style.maxWidth = "100%";
        contentEditableRef.current?.appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const truncateAddress = (address: string) => {
    if (address.length <= 6) return address;
    return `${address.slice(0, 6)}...`;
  };

  return (
  <div className="main-container relative h-[100vh] text-[28px] w-full flex flex-center items-start justify-start">
    <div className="flex flex-col relative sm:overflow-hidden overflow-auto overflow-x-hidden">
        <div className="flex flex-col gap-[25px] md:flex-row items-center px-[1rem]">
          <Link href = "/" className="w-[200px] ">
            <img src="asciart.png" />
          </Link>

          <div className="flex flex-col gap-[10px] text-center md:text-left md:items-start items-center">
            <h1 className="text-[18px]">hello metaverse</h1>

            <p className=" text-[12px] sm:text-[14px] w-[80%]">
              here you are introduced into the ether of engineering, to the new
              way of living, to the new world. welcome.
            </p>

            <span className="mt-[1rem] italic text-[10px] flex-1 flex items-end">
              "there lies a infinite void of possiblites, finite amount of
              probanlites, and you landed here, welcome".
            </span>
          </div>
        </div>

        <div className="banner w-full h-[25px] mt-[20px] flex flex-row justify-start items-start whitespace  text-[12px] sm:text-[14px]text-black overflow-hidden ">
          <div className="marquee w-full flex items-center justify-between overflow-hidden whitespace-nowrap text-black">
            <p className="text-white    capitalize inline-block px-4">
              Ani Gaon{" "}
            </p>
            <p className="text-white   capitalize inline-block px-4">
              Είμαι ιδιοφυΐα
            </p>

            <p className="text-white   capitalize inline-block px-4">
              我是天才
            </p>
            <p className="text-white   capitalize inline-block px-4">
              01000111
            </p>
            <p className="text-white   capitalize inline-block px-4">
              01100101
            </p>
            <p className="text-white   capitalize inline-block px-4">
              01101001
            </p>
            <p className="text-white   capitalize inline-block px-4">
              01110101
            </p>
            <p className="text-white   capitalize inline-block px-4">
              01110011
            </p>
          </div>
        </div>

        <div className="section h-[100%] w-full p-[1rem] overflow-x-hidden">
          <div className="flex flex-row">
            <button className="text-[20px]">{"[ new age of human ]"}</button>
          </div>

          <div className="outer-box pt-[2rem]">
            <div className="flex flex-row gap-[10px]">
              <div className="banner-tag text-[12px] sm:text-[14px] !w-[240px]">
                break into the infinite
              </div>
            </div>

            <div className="flex flex-row gap-[10px]">
              <div className="container-box flex flex-col items-start justify-start p-1 w-full relative">
                <div
                  ref={contentEditableRef}
                  contentEditable
                  className="w-full h-[200px] p-2 text-[12px] sm:text-[14px] outline-none bg-transparent overflow-auto"
                  onInput={handleTextareaChange}
                  onKeyDown={(e) => {
                    if (e.key === "/" && !showCommandPopup) {
                      e.preventDefault();
                      setShowCommandPopup(true);
                    }
                  }}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                />
                {showCommandPopup && (
                  <div className="absolute text-format bottom-12 left-0 border border-gray-300 rounded shadow-lg">
                    <button
                      className="block w-full text-left  px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleCommandClick("paragraph")}
                    >
                      Paragraph
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleCommandClick("header1")}
                    >
                      Header 1
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleCommandClick("header2")}
                    >
                      Header 2
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              className="text-[12px] sm:text-[14px]"
              onClick={handleUpdateArticle}
            >
              {`[update article]`}
            </button>

            <div className="mt-4">
              {[...articles].reverse().map((article, index) => (
                <div
                  key={`${index}-${article.timestamp.getTime()}`}
                  className="mb-4 p-2 border border-gray-300 border-dashed rounded"
                >
                  <div
                    className="text-[12px] sm:text-[14px]"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                  <div className="text-[10px] text-gray-500 mt-2">
                    {format(article.timestamp, "PPpp")}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <button
                      onClick={() => handleUpvote(articles.length - 1 - index)}
                      className="text-[12px] border border-gray-300 px-2 py-1 rounded"
                    >
                      UPVOTE ({article.upvotes || 0})
                    </button>
                    <button
                      onClick={() => handleDonate("user_address_here")}
                      className="text-[12px] border border-gray-300 px-2 py-1 rounded flex flex-row items-center gap-[10px]"
                    >
                      <span>
                        {address ? truncateAddress(address) : "DONATE"}
                      </span>{" "}
                      | Donate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
