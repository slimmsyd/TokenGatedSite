"use client";

import Link from "next/link";
import Video from "./Video";
interface ProjectInfo {
  title: string;
  description: string;
  link: string;
  video?: string;
}

interface PopupProps {
  setPopup: (show: boolean) => void;
  showPopup: boolean;
  projectInfo: [string, ProjectInfo];
}

export default function Popup({
  setPopup,
  showPopup,
  projectInfo,
}: PopupProps) {
  const [key, value] = projectInfo;

  return (
    <div className="flex h-[100%] w-full items-center justify-center absolute popup">
      <div className="container-box no-border !h-full flex flex-col items-center justify-center p-4  top-0 ">
        <button
          onClick={() => setPopup(false)}
          className=" cursor-pointer banner-tag text-[14px]"
        >
          {"EXIT()"}
        </button>

        <div className="flex flex-col gap-[25px] w-[70%] md:w-[100%] md:flex-row items-center  container-border">
          <div className="flex flex-col w-[100%]">
            <div className="p-3 border-bottom-dashed text-[20px]">
              <span>{value.title} </span>
            </div>

            <div className="flex flex-row gap-[20px] ">
              <span className="w-[400px] border-dashed ">
                <Video
                  src={value.video ?? ""}
                  type={value.video ? "video/mp4" : "video/mov"}
                  width="100%"
                  height="auto"
                  controls={true}
                  autoPlay={true}
                  loop={true}
                  muted={false}
                  className="pointerEventsYes"
                />
              </span>

              <div className="flex flex-col w-[50%] gap-[10px] p-3 text-center md:text-left md:items-start items-center">
                <h1 className="text-[18px] ">sass project</h1>

                <p className="text-[14px] w-[80%]">{value.description}</p>

                <Link
                  href={value.link}
                  target="_blank"
                  className="text-[14px]"
                >{`[vist here]`}</Link>
              </div>
            </div>

            <span className="p-[1rem] border-dashed italic text-[10px] flex-1 flex items-end">
              "Energy flows where attention goes."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
