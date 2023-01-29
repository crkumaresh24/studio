import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import OpenQueryDataSource from "./OpenQueryDataSource";
import { DataSource } from "./DatasourceExplorer";
import HTTPDataSource from "./HTTPDataSource";
import OpenAPIDataSource from "./OpenAPIDataSource";
import { useState } from "react";
import { DATA_SOURCE_TYPE } from "../../Constants";

interface SaveDatasourceProps {
  mode: "create" | "edit";
  name: string;
  datasource: DataSource;
  onSave: (name: string, datasource: DataSource) => void;
  onBack: () => void;
}

const SaveDatasource = (props: SaveDatasourceProps) => {
  const [datasource, setDatasource] = useState<DataSource>(props.datasource);
  const [name, setName] = useState<string>(props.name);
  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={3} sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Button
          disabled={!name}
          onClick={() => props.onSave(name, datasource)}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Save
        </Button>
        {props.mode === "edit" && (
          <Typography sx={{ marginLeft: "auto", marginRight: "auto" }}>
            {name}
          </Typography>
        )}
      </Box>
      {props.mode === "create" && (
        <TextField
          autoFocus
          label={"Name"}
          placeholder={"data source name"}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      {props.datasource.type.toString() ===
        DATA_SOURCE_TYPE.OPENQUERY.toString() && (
        <OpenQueryDataSource
          onChange={(props) => setDatasource({ ...datasource, props })}
          {...datasource.props}
        />
      )}
      {props.datasource.type.toString() ===
        DATA_SOURCE_TYPE.HTTP.toString() && (
        <HTTPDataSource
          onChange={(props) => setDatasource({ ...datasource, props })}
          {...datasource.props}
        />
      )}
      {props.datasource.type.toString() ===
        DATA_SOURCE_TYPE.OPENAPI.toString() && (
        <OpenAPIDataSource
          onChange={(props) => setDatasource({ ...datasource, props })}
          {...datasource.props}
        />
      )}
    </Box>
  );
};

export default SaveDatasource;
