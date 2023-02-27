import { Paper, Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { StyledTab, StyledTabs } from "../../App";
import { CONTAINER_HEIGHT } from "../../Constants";
import { readDatasource } from "../../services";
import DatasourceExplorer, { DataSource } from "./DatasourceExplorer";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const DatasourceExplorerHome = () => {
  const query = useQuery();
  const type = query.get("type") || "0";
  const service = query.get("service") || "";
  const [name, setName] = useState<string>(service);
  const [value, setValue] = useState(Number(type));
  const [page, setPage] = useState<"list" | "create" | "edit">("list");
  const [datasource, setDatasource] = useState<DataSource>({
    type: "0",
    props: {},
  });

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setPage("list");
  };

  useEffect(() => {
    service &&
      type &&
      readDatasource(
        String(type),
        service,
        (d) => {
          setDatasource(d);
          setPage("edit");
        },
        () => {}
      );
  }, [service, type]);

  return (
    <Paper
      sx={{
        padding: 1,
        margin: "auto",
        minHeight: CONTAINER_HEIGHT,
        width: "70%",
      }}
    >
      <Stack>
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
          <DatasourceExplorer
            page={page}
            setPage={setPage}
            datasource={datasource}
            setDatasource={setDatasource}
            name={name}
            setName={setName}
            type={String(value)}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DatasourceExplorerHome;
