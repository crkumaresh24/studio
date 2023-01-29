import { Box, Button, IconButton, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import BackIcon from "@mui/icons-material/ArrowBack";

interface CreateActionProps {
  onSave: (name: string) => void;
  onBack: () => void;
}

const CreateAction = (props: CreateActionProps) => {
  const [name, setName] = useState<string>("");
  return (
    <Box gap={4} sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Box gap={3} sx={{ display: "flex" }}>
        <IconButton onClick={(e) => props.onBack()}>
          <BackIcon />
        </IconButton>
        <Button
          onClick={(e) => {
            name && props.onSave(name);
            props.onBack();
          }}
          startIcon={<SaveIcon />}
          size="small"
          variant="contained"
        >
          Save
        </Button>
      </Box>
      <TextField
        variant="outlined"
        label="Name"
        placeholder="actio name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Box>
  );
};

export default CreateAction;
