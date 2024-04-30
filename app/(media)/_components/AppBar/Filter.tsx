import React, { useCallback, useEffect, useState } from "react";
import IconButton from "@/components/IconButton";
import { FilterList as FilterListIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  RadioGroupProps,
  Badge,
  SxProps,
  Theme,
} from "@mui/material";
import Button from "@/components/Button";
import { Status } from "@/models/Media";
import { useFilterContext } from "@/app/(media)/_components/FilterContext";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";

const buttonSx: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.grey["800"],
};
const releaseFilter = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Not Released",
    value: "false",
  },
  {
    label: "Released",
    value: "true",
  },
];

const statusFilter = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Not Owned",
    value: Status.DEFAULT,
  },
  {
    label: "Downloadable",
    value: Status.DOWNLOADABLE,
  },
  {
    label: "Owned",
    value: Status.OWNED,
  },
];

export default function Filter() {
  const [open, setOpen] = useState(false);
  const [releaseState, setReleaseState] = useState<string>("");
  const [statusState, setStatusState] = useState<string | Status>("");
  const { text, isReleased, status, dispatchFilter } = useFilterContext();
  const { dispatchMedia } = useMediaContext();
  const isFilterActive = releaseState !== "" || statusState !== "";

  // Match global state.
  useEffect(() => {
    setReleaseState(isReleased == null ? "" : isReleased ? "true" : "false");
    setStatusState(status == null ? "" : status);
  }, [isReleased, status]);

  // HANDLERS

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleReleaseChange = useCallback<
    NonNullable<RadioGroupProps["onChange"]>
  >((_, value) => {
    setReleaseState(value);
  }, []);
  const handleStatusChange = useCallback<
    NonNullable<RadioGroupProps["onChange"]>
  >((_, value) => {
    setStatusState(value);
  }, []);

  const handleSubmit = useCallback(() => {
    const isReleased =
      releaseState === "" ? undefined : releaseState === "true";
    const status = statusState === "" ? undefined : (statusState as Status);

    dispatchMedia({
      type: "filter",
      text,
      isReleased,
      status,
    });
    setOpen(false);
    dispatchFilter({
      type: "filter",
      isReleased: isReleased ?? null,
      status: status ?? null,
    });
  }, [dispatchFilter, dispatchMedia, releaseState, statusState, text]);

  // RENDER

  return (
    <>
      <IconButton
        label="Filter"
        color="inherit"
        onClick={handleOpen}
        sx={buttonSx}
      >
        <Badge
          variant="dot"
          overlap="circular"
          color="warning"
          invisible={!isFilterActive}
        >
          <FilterListIcon color="inherit" />
        </Badge>
      </IconButton>

      <Dialog disableEscapeKeyDown open={open}>
        <DialogTitle>Filter</DialogTitle>
        <DialogContent>
          <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
            <FormControl color="secondary">
              <FormLabel>Release state</FormLabel>
              <RadioGroup value={releaseState} onChange={handleReleaseChange}>
                {releaseFilter.map((item) => {
                  return (
                    <FormControlLabel
                      key={item.label}
                      value={item.value}
                      control={<Radio color="secondary" />}
                      label={item.label}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormControl color="secondary">
              <FormLabel>Release state</FormLabel>
              <RadioGroup value={statusState} onChange={handleStatusChange}>
                {statusFilter.map((item) => {
                  return (
                    <FormControlLabel
                      key={item.label}
                      value={item.value}
                      control={<Radio color="secondary" />}
                      label={item.label}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
