"use client";
import { useEffect, useState, useRef } from "react";
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
import Popup from "./components/popup";
import Link from "next/link";
import Video from "./components/Video";
import { parseUnits } from "viem";
import { db } from "./lib/db";
import dynamic from 'next/dynamic';

// Dynamically import p5 with ssr option set to false
const p5 = dynamic(() => import('p5').then((p5) => ({ default: (props: any) => <div ref={props.ref} /> })), { ssr: false });

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

  const DONATION_ADDRESS = "0x5AdB53ede35FC38159f7F8d33822907e0A672a52";
  const DONATION_AMOUNT = "1"; // 1 SOL

  const { sendTransaction } = useSendTransaction();

  //Hanlding hte odnation.

  // const handleDonation = async () => {
  //   if (!address) return;

  //   try {
  //     const tx = await sendTransaction({
  //       to: DONATION_ADDRESS,
  //       value: parseUnits(DONATION_AMOUNT, 9), // 9 decimals for SOL
  //     });

  //     // Update database
  //     await fetch("/api/addUser", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         address,
  //         type: "SOL",
  //         amount: DONATION_AMOUNT,
  //       }),
  //     });

  //     // Handle success (e.g., show a success message)
  //     console.log("Donation successful");
  //   } catch (error) {
  //     console.error("Donation failed:", error);
  //     // Handle error (e.g., show error message to user)
  //   }
  // };

  // Add this near your other state variables
  const [donationStatus, setDonationStatus] = useState("");

  //Obect containg personal informaiton
  const personalInfo = {
    NAME: "SYDNEY SANDERS",
    LOCATION: "WASHINGTON D.C.",
    CURRENTLY: "CONTACTOR",
    POSITION: "FOUNDER, SOFTWARE ENGINEERING",
  };
  const entries = Object.entries(personalInfo);

  const workExperience = {
    CODENOIR: "6 MONTHS",
    TSGC: "6 MONTHS",
    SIDEKICKSTUDIOS: "2 MONTHS",
    C2G: "2 YEARS",
  };

  const selectedProjects = {
    "NO.1": {
      title: "SOLOMON SASS | MENTAL FITNESS APP",
      description:
        "An AI-powered mental fitness app to help users improve their well-being.",
      link: "https://www.aisolomon.xyz/",
      video: "https://www.aisolomon.xyz/video_introduction.mp4",
    },
    "NO.2": {
      title: "CREATURES CUBE | BASE NETWORK NFT LAUNCH",
      description:
        "An NFT launch project on the Base Network featuring unique digital creatures.",
      link: "https://creaturecubes.art/",
      video:
        "https://teal-artistic-bonobo-612.mypinata.cloud/ipfs/QmaLGSyy1Q8hiiQh6hfBkUxLTQGsxoY18Ua3r2XsvAETWY",
    },
    "NO.3": {
      title: "BLACK WEB 3 | CRYPTO dAPP",
      description:
        "A decentralized application for crypto enthusiasts in the Web3 space.",
      link: "https://www.blackw3b.io/",
      video:
        "https://teal-artistic-bonobo-612.mypinata.cloud/ipfs/QmSiQQaUMLdEzFpLUjBVa5ck8CwXsQMXKSW6EKKGyqVaNJ/blackweb.mp4",
    },
    "NO.4": {
      title: "CREATED 2 GROW | AGENCY WEBSITE",
      description: "A professional website for a digital growth agency.",
      video:
        "https://teal-artistic-bonobo-612.mypinata.cloud/ipfs/QmSiQQaUMLdEzFpLUjBVa5ck8CwXsQMXKSW6EKKGyqVaNJ/created2grow.mp4",
      link: "https://www.created2grow.com/",
    },
    "NO.5": {
      title: "OLD PORTFOLIO | REACT APP",
      description:
        "Old portoflio website, of rememberance of old times and ideas",
      link: "https://www.syddevs.xyz/",
      video: "https://www.syddevs.xyz/video_introduction.mp4",
    },
  };

  const socialLinik = {
    X: "https://x.com/slimmsyd",
    INSTAGRM: "https://www.instagram.com/syddarchitect",
    LINKEDIN: "https://www.linkedin.com/in/sydneysanders/",
    NEWSLETTER: "2 MONTHS",
  };
  const articles = {
    "NO.1": "BENAVOLENT AI",
    "NO.2": "LANGUAGE AS A PREDICTOR OF REALTIIY",
  };
  const changeLog = {
    "NO.1":
      "Add Database to store wallets that donated 90 cents in SOl || ETH || BTC",
    "NO.2":
      "ADD Sub Social Community for users to share posts | Sign To The Blockhain | SOL",
    "NO.3": "ADD COMMUNITY FORUM FOR USERS TO DISCUSS IDEAS",
  };

  //Popup state
  const [popup, setPopup] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<number>(0);

  useEffect(() => {
    if (isConnected && address) {
      setConnectedAddress(address);
      console.log("Connected address:", address);

      addUser(address);
    }
  }, [isConnected, address]);

  // ... ex

  const addUser = async (userData: any) => {
    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const result = await response.json();
      console.log(result);
      // Handle successful response
    } catch (error) {
      console.error("Error adding user:", error);
      // Handle error
    }
  };
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {        
      const sketch = (p: any) => {
        let s = 3;
      let t = 0;

      // Define the function 'a' which takes x, y, and d as arguments
      const a = (
        x: number,
        y: number,
        d = 2 * Math.cos(p.mag(x / 8 - 25, y / 8 - 25) / 3 - t)
      ) => {
        // Calculate k and e inside the function itself
        const k = x / 8 - 25;
        const e = y / 8 - 25;
        return [x + d * k, y + d * e];
      };

      p.setup = () => {
        let canvas = p.createCanvas(400, 400);
        canvas.elt.style.backgroundColor = "transparent"; // Set canvas background to transparent
        p.clear();
        p.stroke(64, 224, 125, 191); // Note: p5.js uses 0-255 for alpha, so 0.75 * 255 ≈ 191
        // p.noLoop(); // Stops continuous drawing, remove if animation is needed
      };

      p.draw = () => {
        p.clear(); // Clear the canvas instead of setting a background color
        p.randomSeed(0);
        t += 0.02; // Increment time to animate

        // Loop through x and y coordinates
        for (let y = 100; y < 300; y += s) {
          for (let x = 100; x < 300; x += s) {
            // Calculate points and shuffle them before drawing lines
            const points = [a(x, y), a(x, y + s), a(x + s, y)];
            p.line(...p.shuffle(points).flat());
          }
        }
      };
    };
    let p5Instance: any;

    import('p5').then((p5Module) => {
      const p5 = p5Module.default;
      p5Instance = new p5(sketch, sketchRef.current as HTMLElement);
    });
  
    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }
  }, []);

  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["Hello", "World", "Friend", "Welcome", "to", "the", "metaverse", "click", "to", "continue"];

  useEffect(() => {
    const currentWord = words[wordIndex];
    const shouldSwitch = isDeleting ? text === '' : text === currentWord;

    if (shouldSwitch) {
      setIsDeleting(!isDeleting);
      if (!isDeleting) setWordIndex((prev) => (prev + 1) % words.length);
    }

    const timeout = setTimeout(() => {
      setText(prev => isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1));
    }, isDeleting ? 120 : 120);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex]);


  return (
    <div className="main-container relative h-[100vh] text-[28px] w-full flex flex-center items-start justify-start">
      <div className="flex flex-col relative sm:overflow-hidden overflow-auto overflow-x-hidden">
        <div className="flex flex-col gap-[25px] md:flex-row items-center px-[1rem]">
          <span className="w-[200px] ">
            <img src="asciart.png" />
          </span>

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

        <div className="w-full h-[300px] flex items-center justify-center relative ">

          <div className = "absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
            <div className ="cursor-pointer">{text}</div>
          </div>

          <div className="relative opacity-50" ref={sketchRef}></div>

        </div>

        <div className="section h-[100%] w-full p-[1rem] overflow-x-hidden">
          <div className="flex flex-row">
            <button className="text-[20px]">{"[ welcome ]"}</button>
          </div>

          <div className="outer-box pt-[2rem] ">
            <div className="banner-tag  text-[12px] sm:text-[14px]">
              ABOUT-ME
            </div>

            <div className="flex flex-row gap-[10px]">
              <div className="container-box flex flex-col items-start justify-start p-4 w-full">
                <div className="flex flex-col gap-[5px]  text-[12px] sm:text-[14px] w-full ">
                  {Object.entries(personalInfo).map(([key, value], index) => {
                    const lastIndex = index === entries.length - 1;

                    return (
                      <div
                        key={key}
                        className={`pl-[5px] flex flex-row gap-[10px] ${
                          lastIndex ? "last-item" : ""
                        }`}
                      >
                        <p>{key}:</p>
                        <p>{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full">
                <div className="banner-tag  text-[12px] sm:text-[14px]">
                  EXPERIENCE
                </div>

                <div className="container-box flex flex-col items-start justify-start p-4 w-full">
                  <div className="flex flex-col gap-[5px] text-[12px] sm:text-[14px] w-full ">
                    {Object.entries(workExperience).map(
                      ([key, value], index) => {
                        const lastIndex = index === entries.length - 1;

                        return (
                          <div
                            key={key}
                            className={`pl-[5px] flex flex-row gap-[10px] ${
                              lastIndex ? "last-item" : ""
                            }`}
                          >
                            <p>{key}:</p>
                            <p>{value}</p>
                          </div>
                        );
                      }
                    )}

                    <p className="text-[12px] mt-[5px]">
                      ALWAYS OPEN TO GRANDUR OPPORTUNITES
                    </p>
                  </div>
                </div>
              </div>

              {/* <div className="container-box flex flex-col items-center justify-center w-full">
                <button onClick={handleConnect} className="text-[18px]">
  {`${isConnected ? address : "[ connect wallet ]"} `}
</button>

{isConnected ? (
  <div className="text-center flex flex-col items-center gap-[10px]">
    <button
      onClick={() =>
        sendTransaction({
          to: "0xDcFD8d5BD36667D16aDDD211C59BCdE1A9c4e23B",
          value: parseEther(currentBal), // Fallback to '0' if currentBal is null
        })
      }
      className="text-[18px] mt-[20px] cursor-pointer flex items-center justify-center"
    >
      [Sign Transaction]
    </button>
    <p className="text-[14px] text-center">
      Current Bal: {balanceData?.formatted}
    </p>
  </div>
) : null}
              </div> */}
            </div>
          </div>
          <div className="w-full flex flex-col gap-[5px] items-center justify-center mt-6">
            <span
              onClick={handleConnect}
              className="cursor-pointer rotating-image"
            >
              <img src="DotsGreen.png" />
            </span>

            <p className=" text-[12px] sm:text-[14px]">
              {`${isConnected ? address : "[ connect wallet above ]"} `}
            </p>
          </div>

          <div className="outer-box pt-[2rem] ">
            <div className="flex flex-row gap-[10px]">
              <div className="banner-tag text-[12px] sm:text-[14px] !w-[150px]">
                SELECTED-PROJECTS
              </div>
            </div>

            <div className="flex flex-row gap-[10px]">
              <div className="container-box flex flex-col items-start justify-start p-4 w-full">
                <div className="flex flex-col gap-[5px]  text-[12px] sm:text-[14px]  w-full ">
                  {Object.entries(selectedProjects).map(
                    ([key, value], index) => {
                      const lastIndex = index === entries.length - 1;

                      return (
                        <div
                          key={key}
                          onClick={() => {
                            setSelectedProject(index);
                            setPopup(true);
                          }}
                          className={`pl-[5px] flex flex-row gap-[10px] btn-hover
                        }`}
                        >
                          <p>{key}:</p>
                          <p>{value.title}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="outer-box relative pt-[2rem] ">
            <div className="banner-tag  text-[12px] sm:text-[14px] relative !w-[150px]">
              ARTICLES
            </div>

            <div className="flex flex-row gap-[10px]">
              <div className="container-box  overflow-hidden scrollbar-hide relative flex flex-col items-start justify-start p-4 w-full">
                <div className="overlay absolute w-full h-full bg-black/50  flex items-center justify-center mb-4">
                  <button
                    // onClick={handleDonation}
                    className="mb-10 z-10 text-[18px] relative cursor-pointer"
                  >{`[ donate to view ]`}</button>
                </div>

                <div className="flex flex-col gap-[5px]  text-[12px] sm:text-[14px]  w-full ">
                  {Object.entries(articles).map(([key, value], index) => {
                    const lastIndex = index === entries.length - 1;

                    return (
                      <div
                        className={`pl-[5px] flex flex-row gap-[10px] btn-hover
    }`}
                      >
                        {key} | {value}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="banner-tag text-[12px] sm:text-[14px]">
                  CONNECT
                </div>

                <div className="container-box flex flex-col items-start justify-start p-4 w-full">
                  <div className="flex flex-col gap-[5px] text-[12px] sm:text-[14px] w-full ">
                    {Object.entries(socialLinik).map(([key, value], index) => {
                      const lastIndex = index === entries.length - 1;

                      return (
                        <Link
                          target="_blank"
                          href={value}
                          key={key}
                          className={`pl-[5px] flex flex-row gap-[10px] btn-hover
}`}
                        >
                          {key}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="outer-box pt-[2rem] ">
            <div className="flex flex-row gap-[10px]">
              <div className="banner-tag  text-[12px] sm:text-[14px] !w-[150px]">
                SUPPORTERS
              </div>

              <p className=" text-[12px] sm:text-[14px]">
                *users who have supported my work | feature to be added*
              </p>
            </div>

            <div className="flex flex-row gap-[10px]">
              <div className="container-box flex flex-col items-start justify-start p-4 w-full">
                <div className="flex flex-col gap-[5px]  text-[12px] sm:text-[14px] w-full ">
                  {Object.entries(articles).map(([key, value], index) => {
                    const lastIndex = index === entries.length - 1;

                    return (
                      <div
                        className={`pl-[5px] flex flex-row gap-[10px] btn-hover
    }`}
                      >
                        {key} | {address}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="outer-box pt-[2rem] ">
            <div className="flex flex-row gap-[10px]">
              <div className="banner-tag  text-[12px] sm:text-[14px] !w-[150px]">
                CHANGELOG
              </div>

              <p className=" text-[12px] sm:text-[14px]">
                *you know what this is, change is the only constant*
              </p>
            </div>

            <div className="flex flex-row gap-[10px]">
              <div className="container-box flex flex-col items-start justify-start p-4 w-full">
                <div className="flex flex-col gap-[5px] text-[12px] sm:text-[14px] w-full ">
                  {Object.entries(changeLog).map(([key, value], index) => {
                    const lastIndex = index === entries.length - 1;

                    return (
                      <div
                        className={`pl-[5px] flex flex-row gap-[10px] btn-hover
    }`}
                      >
                        {key} | {value}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {popup && (
          <Popup
            setPopup={setPopup}
            showPopup={popup}
            projectInfo={Object.entries(selectedProjects)[selectedProject]}
          />
        )}
      </div>
    </div>
  );
}
