import React from "react";
import { FileOpen } from "@mui/icons-material";
import { transformImage } from "../../libs/features";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img className="w-[200px] h-[150px] object-contain " src={transformImage(url, 200)} alt="Attachement" />);

    case "audio":
      return <audio src={url} preload="none" controls />;

    default:
      return <FileOpen />;
  }
};

export default RenderAttachment;