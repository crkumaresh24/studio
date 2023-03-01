import { Box, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { StyledTab, StyledTabs } from "../../App";
import JsonEditor from "../../libs/JsonEditor";

interface ActionRunResponseProps {
  store?: any;
  logs?: string[];
}

const ActionRunReponse = (props: ActionRunResponseProps) => {
  const [selectedTab, setSelectedTab] = useState(props.store ? 0 : 1);
  return (
    <Stack minHeight={500}>
      <StyledTabs
        value={selectedTab}
        onChange={(_, value) => setSelectedTab(value)}
        aria-label="basic tabs example"
      >
        <StyledTab label="Store" />
        <StyledTab label="Console" />
      </StyledTabs>

      {selectedTab === 0 && props.store && (
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

      {selectedTab === 1 && props.logs && (
        <Stack padding={1}>
          <Paper sx={{ padding: 1 }}>
            {props.logs.map((log) => {
              return <Typography marginBottom={1}>{log}</Typography>;
            })}
          </Paper>
        </Stack>
      )}
    </Stack>
  );
};

export default ActionRunReponse;
