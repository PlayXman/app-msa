import React, {
  SubmitEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  InputAdornment,
  SxProps,
  TextField,
  TextFieldProps,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import IconButton from "@/components/IconButton";
import Media from "@/models/Media";
import MediaGridItemCard, {
  Props as MediaGridItemCardProps,
} from "@/app/(media)/_components/MediaGrid/MediaGridItemCard";
import MediaGridItemLoader from "@/app/(media)/_components/MediaGrid/MediaGridItemLoader";
import { ITEM_WIDTH } from "@/app/(media)/_components/MediaGrid/MediaGrid";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { openNewTab } from "@/models/utils/urlHelpers";

const buttonSx: SxProps<Theme> = {
  bgcolor: "secondary.main",
  "--IconButton-hoverBg": (theme) => theme.palette.secondary.dark,
};
const backgroundSx: SxProps<Theme> = {
  minHeight: "100%",
  backgroundColor: (theme) => theme.palette.background.default,
};
const toolbarSx: SxProps = {
  justifyContent: "space-between",
};
const contentSx: SxProps = {
  py: 3,
};
const listSx: SxProps = {
  display: "grid",
  justifyItems: "stretch",
  justifyContent: "center",
  alignContent: "start",
  alignItems: "stretch",
  gap: 2,
  gridTemplateColumns: {
    xs: "repeat(2, 1fr)",
    sm: `repeat(auto-fit, ${ITEM_WIDTH}px)`,
  },
  gridAutoFlow: "row",
};
const textFeedbackSx: SxProps = {
  marginTop: "28vh",
  textAlign: "center",
  gridColumn: "1 / -1",
};

export const QUICK_SEARCH_URL_PROPERTY_NAME = "search-new-q";

export interface Props {
  /**
   * @param text Sanitized search text.
   */
  onSearch: (text: string) => Promise<Media[]>;
}

export default function AddMediaButton({ onSearch }: Props) {
  const searchFieldRef = useRef<HTMLDivElement>(null);
  /** Is the dialog opened for the first time? */
  const [firstOpen, setFirstOpen] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [addingItem, setAddingItem] = useState(false);

  const { items: mediaStateItems, dispatchMedia, loading } = useMediaContext();
  const urlPathname = usePathname();
  const urlSearchParams = useSearchParams();
  const router = useRouter();

  const fetchResults = useCallback(async () => {
    const text = searchText.trim();

    if (loading) return;
    if (!text.length) return;

    setFirstOpen(false);
    setSearching(true);
    setSearchResults(await onSearch(text));
    setSearching(false);
  }, [loading, onSearch, searchText]);

  // HANDLERS

  const handleOpen = useCallback(() => {
    router.push(`?${QUICK_SEARCH_URL_PROPERTY_NAME}=`);
  }, [router]);
  const handleClose = useCallback(() => {
    router.push(urlPathname);
  }, [router, urlPathname]);

  const handleSearchChange = useCallback<
    NonNullable<TextFieldProps["onChange"]>
  >((event) => {
    setSearchText(event.target.value);
  }, []);
  const handleClearSearch = useCallback(() => {
    setSearchText("");
    searchFieldRef.current?.focus();
  }, []);
  const handleSubmitSearch = useCallback<SubmitEventHandler>(
    async (event) => {
      event.preventDefault();
      await fetchResults();
    },
    [fetchResults],
  );

  const handleAddItem = useCallback(
    async (item: Media) => {
      setAddingItem(true);
      await item.save();
      dispatchMedia({
        type: "add",
        item: {
          id: item.id,
          display: true,
          model: item,
        },
      });
      setAddingItem(false);
    },
    [dispatchMedia],
  );

  const handleItemInfoPageNavigation = useCallback<
    NonNullable<MediaGridItemCardProps["onClick"]>
  >((model) => {
    openNewTab(model.searchInfoLink);
  }, []);

  // EFFECTS

  const quickSearchValue = urlSearchParams.get(QUICK_SEARCH_URL_PROPERTY_NAME);
  const open = quickSearchValue != null;

  // According to the URL param open or close the dialog and perform quick-search.
  useEffect(() => {
    if (!loading && fetchResults && firstOpen) {
      if (quickSearchValue) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchText(quickSearchValue);
        fetchResults().then();
      }
    }
  }, [loading, firstOpen, fetchResults, quickSearchValue]);

  // RENDER

  return (
    <>
      <IconButton
        label="New item"
        color="inherit"
        onClick={handleOpen}
        sx={buttonSx}
        edge="end"
      >
        <AddIcon color="inherit" />
      </IconButton>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        hideBackdrop
        slotProps={{
          paper: {
            sx: backgroundSx,
          },
        }}
      >
        <AppBar position="fixed" color="secondary" enableColorOnDark>
          <Toolbar sx={toolbarSx}>
            <Typography variant="h6" sx={{ color: "inherit" }}>
              New Item
            </Typography>
            <IconButton color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container maxWidth="sm" sx={contentSx}>
          <Box sx={listSx}>
            <Box
              component="form"
              onSubmit={handleSubmitSearch}
              sx={{ gridColumn: "1 / -1" }}
            >
              <TextField
                placeholder="Search title..."
                type="search"
                margin="none"
                color="secondary"
                variant="outlined"
                autoFocus
                fullWidth
                value={searchText}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    inputRef: searchFieldRef,
                    endAdornment: searchText.length ? (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClearSearch}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
              />
            </Box>

            {loading ? (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={textFeedbackSx}
              >
                Loading content...
              </Typography>
            ) : searching ? (
              Array(5)
                .fill(undefined)
                .map((_, i) => (
                  <div key={i}>
                    <MediaGridItemLoader />
                  </div>
                ))
            ) : searchResults.length ? (
              searchResults.map((searchResult) => {
                const isAdded = mediaStateItems.some((item) =>
                  searchResult.isEqual(item.model),
                );

                return (
                  <div key={searchResult.mainVendorId}>
                    <MediaGridItemCard
                      model={searchResult}
                      onClick={handleItemInfoPageNavigation}
                      actions={
                        <IconButton
                          label="Add"
                          onClick={() => handleAddItem(searchResult)}
                          loading={addingItem}
                          disabled={isAdded}
                          color="secondary"
                          size="small"
                        >
                          <AddCircleIcon />
                        </IconButton>
                      }
                    />
                  </div>
                );
              })
            ) : (
              <Typography
                variant="body1"
                color="textSecondary"
                sx={textFeedbackSx}
              >
                {firstOpen ? "Start searching" : "No results"}
              </Typography>
            )}
          </Box>
        </Container>
      </Drawer>
    </>
  );
}
