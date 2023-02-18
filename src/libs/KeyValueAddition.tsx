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
import { KeyValueEntry } from "../Constants";

interface KeyValueAdditionProps {
  title: string;
  list: KeyValueEntry[];
  onListChange: (list: KeyValueEntry[]) => void;
  onlyKey?: boolean;
}

const KeyValueAddition = (props: KeyValueAdditionProps) => {
  const [showAdd, setShowAdd] = useState<boolean>();
  const [newEntry, setNewEntry] = useState<KeyValueEntry>({
    key: "",
    value: "",
  });
  return (
    <Box>
      <Stack alignItems={"center"} direction={"row"}>
        <Typography variant="subtitle1">{props.title}</Typography>
        <IconButton
          onClick={() => {
            setNewEntry({
              key: "",
              value: "",
            });
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
            value={newEntry.key}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                key: e.target.value,
              })
            }
          />
          {!props.onlyKey && (
            <TextField
              size="small"
              value={newEntry.value}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  value: e.target.value,
                })
              }
            />
          )}
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
              setNewEntry({
                key: "",
                value: "",
              });
              setShowAdd(false);
            }}
          >
            Cancel
          </Button>
        </Stack>
      )}
      <List dense>
        {(props.list || []).map((keyValue) => {
          return (
            <ListItem
              disablePadding
              secondaryAction={
                <IconButton
                  size="small"
                  onClick={() => {
                    props.onListChange(
                      props.list.filter((k) => k.key !== keyValue.key)
                    );
                  }}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="body2">
                      {props.onlyKey
                        ? keyValue.key
                        : keyValue.key + " - " + keyValue.value}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default KeyValueAddition;
