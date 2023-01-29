import { Stack } from "@mui/material";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import DAGDesigner from "./DAGDesigner";
import DesignerTools from "./DesignerTools";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const DesignerHome = () => {
  const query = useQuery();
  const action = query.get("action");
  return (
    <>
      {action ? (
        <Stack
          direction={"row"}
          sx={{ margin: 1, height: "calc(100vh - 80px)" }}
        >
          <DesignerTools />
          <DAGDesigner name={action} />
        </Stack>
      ) : (
        "No action selected"
      )}
    </>
  );
};

export default DesignerHome;
