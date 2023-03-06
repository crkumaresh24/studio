import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { StyledTab, StyledTabs } from "../../App";
import JsonEditor from "../../libs/JsonEditor";

interface ActionRunResponseProps {
  store?: any;
  logs?: string[];
}

const ActionRunReponse = (props: ActionRunResponseProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <Stack minHeight={500}>
      <StyledTabs
        value={selectedTab}
        onChange={(_, value) => setSelectedTab(value)}
        aria-label="basic tabs example"
      >
        <StyledTab label="Console" />
      </StyledTabs>

      {selectedTab === 0 && props.logs && (
        <Stack padding={1}>
          {props.logs.map((log) => {
            return (
              <Box sx={{ borderBottom: "1px solid rgba(171, 183, 183, 0.4)" }}>
                <Typography padding={1}>{JSON.stringify(log)}</Typography>
              </Box>
            );
          })}
        </Stack>
      )}

      {selectedTab === 1 && props.store && (
        <Box padding={2} sx={{ minHeight: 500 }}>
          <div className="jse-theme-dark">
            <JsonEditor
              className={"json-output"}
              mode={"text"}
              content={{
                json: props.store || {},
              }}
              readOnly={true}
            />
          </div>
        </Box>
      )}
    </Stack>
  );
};

export default ActionRunReponse;
