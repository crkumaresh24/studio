import { Box, SxProps, Typography } from "@mui/material";
import { Handle, NodeProps, Position } from "reactflow";
import {
  boxHeight,
  boxWidth,
  handleSize,
  inHandleColor,
  handleSideGap,
  out0HandleColor,
  out1HandleColor,
} from "../../../Constants";
import { ToolData } from "./DesignerTools";

const getStyleForType = (data: ToolData): SxProps => {
  if (data.actionType && data.actionType.toLowerCase() === "start") {
    return {
      height: 40,
      width: 40,
      borderRadius: "50%",
      background: "white",
      cursor: "context-menu",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flex: 1,
      color: "black",
    };
  } else {
    return {
      height: boxHeight,
      width: boxWidth,
      borderRadius: 1,
      background: "white",
      cursor: "context-menu",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flex: 1,
      color: "black",
    };
  }
};

export const HandleIn = (props: NodeProps) => {
  return (
    <Handle
      type="target"
      position={Position.Top}
      id="a"
      style={{
        top: -4,
        width: handleSize,
        height: handleSize,
        background: inHandleColor,
      }}
      isConnectable={props.isConnectable}
    />
  );
};

export const HandleOut0 = (props: NodeProps) => {
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        id="0"
        style={{
          width: handleSize,
          height: handleSize,
          left: boxWidth - handleSideGap,
          background: out0HandleColor,
        }}
        isConnectable={props.isConnectable}
      />
      <div
        style={{
          position: "fixed",
          top: boxHeight - 14,
          left: boxWidth - handleSideGap - 2,
          fontSize: 8,
        }}
      >
        E
      </div>
    </>
  );
};

export const HandleOut1 = (props: NodeProps) => {
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        id="1"
        style={{
          width: handleSize,
          height: handleSize,
          left: handleSideGap,
          background: out1HandleColor,
        }}
        isConnectable={props.isConnectable}
      />
      {props.data.actionType.toLowerCase() !== "start" && (
        <div
          style={{
            position: "fixed",
            left: handleSideGap - 2,
            top: boxHeight - 14,
            fontSize: 8,
          }}
        >
          S
        </div>
      )}
    </>
  );
};

export const HandleOut2 = (props: NodeProps) => {
  return (
    <>
      <Handle
        type="source"
        position={Position.Bottom}
        id="2"
        style={{ left: 24, width: 4, height: 4 }}
        isConnectable={props.isConnectable}
      />
      <div
        style={{
          position: "fixed",
          top: boxHeight - 14,
          left: handleSideGap - 2,
          fontSize: 8,
        }}
      >
        L
      </div>
    </>
  );
};

const DAGNode = (props: NodeProps) => {
  return (
    <Box sx={getStyleForType(props.data)}>
      <Typography sx={{ margin: "auto" }}>{props.data.label}</Typography>
      {props.type.includes("In1") && <HandleIn {...props} />}
      {props.type.includes("Out2") && <HandleOut2 {...props} />}
      {props.type.includes("Out1") && <HandleOut1 {...props} />}
      {props.type.includes("Out0") && <HandleOut0 {...props} />}
    </Box>
  );
};

export const nodeTypes = {
  In1: DAGNode,
  Out1: DAGNode,
  In1Out0Out1: DAGNode,
  In1Out0Out1Out2: DAGNode,
};
