import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";

const CardMenu = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        sx={{
          position: "absolute",
          zIndex: 2,
          right: 5,
          top: 5,
          background: "rgba(255,255,255, .3)",
        }}
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        aria-haspopup="true"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "long-button" }}
      >
        {children}
      </Menu>
    </>
  );
};

export default CardMenu;
