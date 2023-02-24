import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import toolsSpec from "./ActionTools.json";

export interface ToolData {
  label: string;
  actionType: string;
}

export interface Tool {
  type: string;
  shortName: string;
  data: any;
}

export const getRandomPosition = () => {
  return [
    Math.floor(Math.random() * 100) + 10,
    Math.floor(Math.random() * 100) + 10,
  ];
};

const DesignerTools = () => {
  //@ts-ignore
  const tools: Record<string, Tool[]> = toolsSpec;

  const [expanded, setExpanded] = useState<string[]>(Object.keys(tools));

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(
        newExpanded ? [...expanded, panel] : expanded.filter((e) => e !== panel)
      );
    };
  return (
    <Paper sx={{ maxWidth: 350, overflow: "auto" }}>
      <Stack>
        {Object.keys(tools).map((group) => {
          return (
            <Accordion
              disableGutters
              key={group}
              expanded={expanded.includes(group)}
              onChange={handleChange(group)}
            >
              <AccordionSummary
                aria-controls={group + "-content"}
                id={group + "-panel1d-header"}
              >
                <Typography>{group.toUpperCase()}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack flexWrap={"wrap"} gap={1} direction={"row"}>
                  {(tools[group] || []).map((action) => {
                    return (
                      <Box
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("group", "action");
                          e.dataTransfer.setData(
                            "payload",
                            JSON.stringify({
                              ...action,
                              id: "act-" + uuidv4(),
                              position: getRandomPosition(),
                              data: {
                                ...action.data,
                                group: group,
                                props: {},
                              },
                            })
                          );
                        }}
                        key={action.shortName}
                        sx={{
                          border: "1px solid rgb(133, 133, 133)",
                          borderRadius: 1,
                          padding: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {action.shortName}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default DesignerTools;
