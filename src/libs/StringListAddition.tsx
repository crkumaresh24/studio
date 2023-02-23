import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

interface StringListAdditionProps {
  title: string;
  list: string[];
  onListChange: (list: string[]) => void;
}

const StringListAddition = (props: StringListAdditionProps) => {
  const [showAdd, setShowAdd] = useState<boolean>();
  const [newEntry, setNewEntry] = useState<string>("");
  return (
    <Box>
      <Stack alignItems={"center"} direction={"row"}>
        <Typography variant="subtitle1">{props.title}</Typography>
        <IconButton
          onClick={() => {
            setNewEntry("");
            setShowAdd(true);
          }}
        >
          <Add />
        </IconButton>
      </Stack>
      {showAdd && (
        <Stack gap={2} direction={"row"}>
          <TextField
            autoFocus
            size="small"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          />
          <Button
            onClick={() => {
              props.onListChange([...(props.list || []), newEntry]);
              setShowAdd(false);
            }}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              setNewEntry("");
              setShowAdd(false);
            }}
          >
            Cancel
          </Button>
        </Stack>
      )}
      <List dense>
        {(props.list || []).map((value) => {
          return (
            <ListItem
              disablePadding
              secondaryAction={
                <IconButton
                  size="small"
                  onClick={() => {
                    props.onListChange(props.list.filter((k) => k !== value));
                  }}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemText
                  primary={<Typography variant="body2">{value}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default StringListAddition;
