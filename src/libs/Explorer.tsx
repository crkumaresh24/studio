import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Checkbox,
  IconButton,
  MenuItem,
  alpha,
  Menu,
  MenuProps,
  styled,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useState } from "react";
import { DeleteOutline } from "@mui/icons-material";

const iconsRegistry: Record<string, React.ReactElement> = {
  edit: <EditIcon />,
  copy: <FileCopyIcon />,
  delete: <DeleteOutline />,
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export interface Action {
  id: string;
  title: string;
  startIcon?: string;
}

export interface Row {
  id: string;
  title: string;
}

interface ExplorerProps {
  rows: Row[];
  selectable?: boolean;
  selected?: string[];
  onSelectionChange?: (selected: string[]) => void;
  secondaryActions?: Action[];
  onSecondaryAction?: (row: Row, action: Action) => void;
  onClick?: (row: Row) => void;
}

const Explorer = (props: ExplorerProps) => {
  const [currentSelected, setCurrentSelected] = useState<Row | undefined>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSecondaryMenu = Boolean(anchorEl);
  const handleSecondaryMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    row: Row
  ) => {
    event.stopPropagation();
    setCurrentSelected(row);
    setAnchorEl(event.currentTarget);
  };
  const handleSecondaryMenuClose = (action?: Action) => {
    currentSelected &&
      action &&
      props.onSecondaryAction &&
      props.onSecondaryAction(currentSelected, action);
    setCurrentSelected(undefined);
    setAnchorEl(null);
  };

  const getSecondaryActionsMenu = (actions: Action[]) => {
    return (
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={openSecondaryMenu}
        onClose={() => handleSecondaryMenuClose()}
      >
        {actions.map((a) => {
          return (
            <MenuItem
              key={a.id}
              onClick={() => handleSecondaryMenuClose(a)}
              disableRipple
            >
              {a.startIcon && iconsRegistry[a.startIcon]}
              {a.title}
            </MenuItem>
          );
        })}
      </StyledMenu>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <nav aria-label="main mailbox folders">
        <List dense>
          {props.rows.map((r) => {
            return (
              <ListItem
                key={r.id}
                disablePadding
                onClick={() => props.onClick && props.onClick(r)}
                secondaryAction={
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={openSecondaryMenu ? "long-menu" : undefined}
                    aria-expanded={openSecondaryMenu ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleSecondaryMenuClick(e, r)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemButton>
                  {props.selectable && (
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={(props.selected || []).includes(r.id)}
                        onChange={(e, checked) => {
                          if (props.onSelectionChange) {
                            if (checked) {
                              props.onSelectionChange([
                                ...(props.selected || []),
                                r.id,
                              ]);
                            } else {
                              props.onSelectionChange(
                                (props.selected || []).filter((s) => s !== r.id)
                              );
                            }
                          }
                        }}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText primary={r.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </nav>
      {props.secondaryActions &&
        getSecondaryActionsMenu(props.secondaryActions)}
    </Box>
  );
};

export default Explorer;