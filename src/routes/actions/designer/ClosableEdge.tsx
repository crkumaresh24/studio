//@ts-nocheck
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { getSmoothStepPath, getEdgeCenter } from "react-flow-renderer";

const foreignObjectSize = 40;

export default function ClosableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    color: "green",
  },
  markerEnd,
  data,
}) {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeDasharray: 0,
          stroke: "darkgrey",
          strokeWidth: 0.5,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 6}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            data.context.remove();
          }}
          aria-label="cut"
          iconName="cut"
          style={{
            marginLeft: 15,
            cursor: "pointer",
            fontSize: 10,
            color: "#b0a2a2",
          }}
        >
          <Close />
        </IconButton>
      </foreignObject>
    </>
  );
}
