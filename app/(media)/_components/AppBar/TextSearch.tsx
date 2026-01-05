import React, {
  useCallback,
  useState,
  FocusEventHandler,
  useEffect,
} from "react";
import {
  Autocomplete,
  AutocompleteProps,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useFilterContext } from "@/app/(media)/_components/FilterContext";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";

const fieldSx: SxProps<Theme> = {
  borderRadius: 50,
  backgroundColor: (theme) => theme.palette.grey["800"],
  "& input": {
    // color: "primary.contrastText",
  },
  "& input::placeholder": {
    // opacity: 0.8,
    // color: "primary.contrastText",
  },
  "& .MuiAutocomplete-clearIndicator": {
    // color: "primary.contrastText",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "transparent !important",
  },
};

export default function TextSearch() {
  const [searchText, setSearchText] = useState("");
  const { model, dispatchMedia } = useMediaContext();
  const { isReleased, status, dispatchFilter } = useFilterContext();
  const { labels } = useLabelContext();

  // Reset on page navigation.
  useEffect(() => {
    if (model) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchText("");
    }
  }, [model]);

  // Filter on text change.
  useEffect(() => {
    const search = searchText.trim();
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    if (search.length > 2 || search.length === 0) {
      timeoutId = setTimeout(() => {
        dispatchMedia({
          type: "filter",
          text: search,
          isReleased: isReleased ?? undefined,
          status: status ?? undefined,
        });
      }, 250);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatchMedia, isReleased, searchText, status]);

  // Memoize search field value.
  const handleChange = useCallback<
    NonNullable<AutocompleteProps<any, any, any, any>["onInputChange"]>
  >((_, nextValue) => {
    setSearchText(nextValue);
  }, []);

  // Memoize filter.
  const handleBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      dispatchFilter({
        type: "filter",
        text: event.currentTarget.value.trim(),
      });
    },
    [dispatchFilter],
  );

  return (
    <Autocomplete
      freeSolo
      blurOnSelect
      options={labels}
      onInputChange={handleChange}
      value={searchText}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={fieldSx}
          placeholder={`Search...`}
          margin="none"
          variant="outlined"
          type="search"
          size="small"
          onBlur={handleBlur}
        />
      )}
    />
  );
}
