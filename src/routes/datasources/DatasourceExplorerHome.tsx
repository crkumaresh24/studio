import { Paper, Stack } from "@mui/material";
import React, { useState } from "react";
import { StyledTab, StyledTabs } from "../../App";
import {
  CONTAINER_HEIGHT,
  DATA_SOURCE_TYPE,
  SHRINK_SIZE,
} from "../../Constants";
import DatasourceExplorer from "./DatasourceExplorer";

const DatasourceExplorerHome = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Stack margin={0.25} alignItems={"center"}>
      <Paper
        sx={{
          padding: 1,
          minHeight: CONTAINER_HEIGHT,
          minWidth: SHRINK_SIZE,
        }}
      >
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <StyledTab label="HTTP" />
          <StyledTab label="OpenAPI (Swagger)" />
          <StyledTab label="OpenQuery" />
        </StyledTabs>

        <Stack padding={1}>
          {value === 0 && <DatasourceExplorer type={DATA_SOURCE_TYPE.HTTP} />}
          {value === 1 && (
            <DatasourceExplorer type={DATA_SOURCE_TYPE.OPENAPI} />
          )}
          {value === 2 && (
            <DatasourceExplorer type={DATA_SOURCE_TYPE.OPENQUERY} />
          )}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DatasourceExplorerHome;
