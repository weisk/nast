import * as React from "react"
import * as NAST from "nast-types"
import { RendererProps } from "../interfaces"
import { SemanticStringArray } from "./SemanticString"

export interface TextProps extends RendererProps {
  current: NAST.Text
}

export function Text(props: TextProps) {
  const name = "text"
  return (
    <>
      <p id={props.current.uri} className={name}>
        <SemanticStringArray semanticStringArray={props.current.title} />
      </p>
      {
        props.children.length ?
          <div className={`${name}__children`}>
            {props.children}
          </div>
          : ""
      }
    </>
  )
}