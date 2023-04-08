import React from "react";

import { useConfigProvider } from "@vkontakte/vkui";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Copy } from "../Copy";
import classes from "./CodeBlock.module.css";

function isOneOperand(children) {
  return children[0].split(" ").length === 1;
}

function CodeBlock({ children, hasCopy }) {
  const { appearance } = useConfigProvider();
  const oneOperand = isOneOperand(children);
  const oneOperandClass = oneOperand ? "isOneOperand" : "";

  return (
    <span className={classes.codeContainer}>
      <SyntaxHighlighter
        className={`${oneOperandClass} code`}
        style={appearance === "dark" ? oneDark : oneLight}
        children={String(children).replace(/\n$/, "")}
        language="js"
      />

      {!oneOperand && (
        <span className={classes.additional}>
          {hasCopy && <Copy textToClickBoard={children[0]} />}
        </span>
      )}
    </span>
  );
}

export default CodeBlock;