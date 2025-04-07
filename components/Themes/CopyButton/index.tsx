import React from "react";
import Button from "../Button";
import { ClipboardDocumentIcon } from "react-native-heroicons/outline";
import { Sizes } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import copyToClipboard from "@/utils/copyToClipboard";

interface iCopyButton {
  text: string;
  size?: number;
  color?: string;
  [key: string]: any;
}

const CopyButton = ({
  text = "Text For Copy",
  size = Sizes["xl"],
  color = Colors.caption,
  ...props
}: iCopyButton) => {
  return (
    <Button
      varient="iconButton"
      Icon={ClipboardDocumentIcon}
      iconOptions={{ size: size, color: color }}
      onPress={() => {
        copyToClipboard(`${text}`);
      }}
      {...props}
    />
  );
};

export default CopyButton;
