import { Api, Dataset, Language } from "@mui/icons-material";
import { Paper, Stack, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { DATA_SOURCE_TYPE } from "../../Constants";
import DatasourceExplorer from "./DatasourceExplorer";

const DatasourceExplorerHome = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Stack sx={{ maxWidth: "60%", margin: "auto" }}>
      <Paper sx={{ padding: 1, minHeight: "calc(100vh - 64px)" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab icon={<Language />} iconPosition="start" label="HTTP" />
          <Tab icon={<Api />} iconPosition="start" label="OpenAPI (Swagger)" />
          <Tab icon={<Dataset />} iconPosition="start" label="Openquery" />
        </Tabs>

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
