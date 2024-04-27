import { Box, SxProps, Typography } from "@mui/material";
import React, { useCallback, useReducer } from "react";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import MediaGridItemLoader from "@/app/(media)/_components/MediaGrid/MediaGridItemLoader";
import MediaGridItem, {
  Props as MediaGridItemProps,
} from "@/app/(media)/_components/MediaGrid/MediaGridItem";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import Media, { Status } from "@/models/Media";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import MediaGridItemMenu, {
  Props as MediaGridItemMenuProps,
} from "@/app/(media)/_components/MediaGrid/MediaGridItemMenu";
import { slugToAlphabet } from "@/models/utils/formatters";

export const ITEM_WIDTH = 158;
const GAP_SX_WIDTH = 1;

const listSx: SxProps = {
  margin: "0 auto",
  maxWidth: (ITEM_WIDTH + GAP_SX_WIDTH * 8) * 6,
  display: "grid",
  justifyItems: "stretch",
  justifyContent: "center",
  alignContent: "start",
  alignItems: "stretch",
  gap: GAP_SX_WIDTH,
  gridTemplateColumns: {
    xs: "repeat(2, 50%)",
    sm: `repeat(auto-fit, ${ITEM_WIDTH}px)`,
  },
  gridAutoFlow: "row",
};
const noItemsSx: SxProps = {
  textAlign: "center",
  gridColumn: "span 2",
  marginTop: "33vh",
};

export interface Props {
  loading: boolean;
  extraActions?: MediaGridItemMenuProps["extraActions"];
}

// Menu reducer
interface MenuState {
  open: boolean;
  selectedItemId: Media["id"];
}

function menuReducer(
  state: MenuState,
  action:
    | { type: "open"; itemId: MenuState["selectedItemId"] }
    | { type: "close" },
): MenuState {
  switch (action.type) {
    case "open":
      return {
        open: true,
        selectedItemId: action.itemId,
      };
    case "close":
      return {
        open: false,
        selectedItemId: state.selectedItemId,
      };
    default:
      throw new Error(`Unknown action type`);
  }
}

export default function MediaGrid({
  loading,
  extraActions = () => null,
}: Props) {
  const [menu, dispatchMenu] = useReducer(menuReducer, {
    open: false,
    selectedItemId: "",
  });
  const { items, dispatchMedia } = useMediaContext();
  const { update: updateLabels } = useLabelContext();
  const notification = useNotificationDispatch();

  // HANDLERS

  // Menu
  const handleSelectItem = useCallback<MediaGridItemProps["onClick"]>(
    (model) => {
      dispatchMenu({ type: "open", itemId: model.id });
    },
    [],
  );
  const handleCloseMenu = useCallback(() => {
    dispatchMenu({ type: "close" });
  }, []);

  const handleStatusChange = useCallback<MediaGridItemProps["onStatusChange"]>(
    async (model) => {
      try {
        const nextModel = model.clone();
        switch (nextModel.status) {
          case Status.DEFAULT:
            nextModel.status = Status.DOWNLOADABLE;
            break;
          case Status.DOWNLOADABLE:
            nextModel.status = Status.OWNED;
            break;
          case Status.OWNED:
          default:
            nextModel.status = Status.DEFAULT;
            break;
        }

        await nextModel.save();
        dispatchMedia({
          type: "update",
          item: {
            model: nextModel,
            display: true,
            id: nextModel.id,
          },
        });
      } catch (error) {
        notification({
          type: "error",
          message: "Failed to update status",
          error,
        });
      }
    },
    [dispatchMedia, notification],
  );

  const handleLabelsUpdate = useCallback<
    MediaGridItemMenuProps["onLabelsUpdate"]
  >(
    async (model, nextLabels) => {
      try {
        const nextModel = model.clone();
        nextModel.labels = nextLabels;

        await nextModel.save();
        dispatchMedia({
          type: "update",
          item: {
            model: nextModel,
            display: true,
            id: nextModel.id,
          },
        });
        notification({ type: "log", message: "Labels updated" });
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to update labels",
          error: e,
        });
      }
    },
    [dispatchMedia, notification],
  );

  const handleTitleCopy = useCallback<MediaGridItemMenuProps["onTitleCopy"]>(
    async (model) => {
      try {
        await navigator.clipboard.writeText(model.title);
        notification({ type: "log", message: "Title copied" });
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to copy title",
          error: e,
        });
      }
    },
    [notification],
  );

  const handleDeleteItem = useCallback<MediaGridItemMenuProps["onDelete"]>(
    async (model) => {
      try {
        await model.delete();
        await updateLabels([], model.labels);
        handleCloseMenu();
        dispatchMedia({
          type: "remove",
          id: model.id,
        });
      } catch (e) {
        notification({ type: "error", message: "Failed to delete", error: e });
      }
    },
    [updateLabels, handleCloseMenu, dispatchMedia, notification],
  );

  // RENDER

  let alphabetLetter = "";
  const displayAtLeastOne = items.some((i) => i.display);

  return (
    <Box sx={listSx}>
      {loading ? (
        Array(6)
          .fill(undefined)
          .map((_, i) => (
            <div key={i}>
              <MediaGridItemLoader />
            </div>
          ))
      ) : (
        <>
          {items.length > 0 &&
            items.map((item) => {
              const firstLetter = slugToAlphabet(item.model);
              let id: string | undefined = undefined;
              if (alphabetLetter !== firstLetter) {
                alphabetLetter = firstLetter;
                id = alphabetLetter;
              }

              return (
                <Box
                  key={item.id}
                  display={!item.display ? "none" : undefined}
                  id={id}
                >
                  <MediaGridItem
                    model={item.model}
                    highlight={menu.open && menu.selectedItemId === item.id}
                    onClick={handleSelectItem}
                    onStatusChange={handleStatusChange}
                  />
                </Box>
              );
            })}
          {items.length === 0 ||
            (!displayAtLeastOne && (
              <Box sx={noItemsSx}>
                <Typography variant="body1">Nothing to show</Typography>
              </Box>
            ))}
        </>
      )}
      <MediaGridItemMenu
        open={menu.open}
        model={items.find((i) => i.id === menu.selectedItemId)?.model}
        onClose={handleCloseMenu}
        onStatusChange={handleStatusChange}
        onTitleCopy={handleTitleCopy}
        onLabelsUpdate={handleLabelsUpdate}
        onDelete={handleDeleteItem}
        extraActions={extraActions}
      />
    </Box>
  );
}
