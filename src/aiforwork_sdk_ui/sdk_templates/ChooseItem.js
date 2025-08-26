import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";

import { normalize } from "../utils/CommonFunctions";
import Avatar from "../sdk_components/avatars/Avatar";
import _ from "lodash";
import { CheckMark } from "../icons";

// Constants for better maintainability
const COLORS = {
  PRIMARY: "#155EEF",
  TEXT_PRIMARY: "#101828",
  TEXT_SECONDARY: "#344054",
  TEXT_TERTIARY: "#667085",
  BORDER: "#D0D5DD",
  BORDER_SECONDARY: "#475467",
  BACKGROUND_DISABLED: "#EAECF0",
  WHITE: "#FFF",
  DISABLED_TEXT: "#98A2B3",
};

const SPACING = {
  SMALL: 10,
  MEDIUM: 12,
  LARGE: 16,
  EXTRA_LARGE: 20,
  BOTTOM: 30,
};

const SIZES = {
  AVATAR_RADIUS: 32,
  CHECK_ICON: 20,
};

const ChooseItem = ({
  type = "multiselect",
  selectedChoices = [],
  recentSelectedItem = [],
  done,
  onCancelPress,
}) => {
  const [localSelectedItems, setLocalSelectedItems] = useState(() =>
    _.cloneDeep(selectedChoices)
  );

  // Reset local state when selectedChoices changes
  useEffect(() => {
    setLocalSelectedItems(_.cloneDeep(selectedChoices));
  }, [selectedChoices]);

  const itemSelected = useCallback(
    (item) => {
      if (type === "dropdown") {
        // Replace selection for dropdown
        setLocalSelectedItems([item]);
        // Sheet dismiss
        done([item]);
      } else {
        setLocalSelectedItems((prevItems) => {
          const currentItems = prevItems || [];

          if (currentItems.length > 0) {
            // If contains remove else add
            const index = currentItems.findIndex(
              (existingItem) => existingItem.id === item.id
            );

            if (index !== -1) {
              // Remove item
              const newItems = [...currentItems];
              newItems.splice(index, 1);
              return newItems;
            } else {
              // Add item
              return [...currentItems, item];
            }
          } else {
            // Add first item
            return [item];
          }
        });
      }
    },
    [type, done]
  );

  const hasChanges = useMemo(() => {
    return !_.isEqual(selectedChoices || [], localSelectedItems || []);
  }, [selectedChoices, localSelectedItems]);

  const donePress = useCallback(() => {
    done(localSelectedItems);
  }, [done, localSelectedItems]);

  const renderOptionItem = useCallback(
    ({ item, index }) => {
      const itemIndex = localSelectedItems?.findIndex(
        (existingItem) => existingItem.id === item.id
      );

      // Simplified and corrected logic for enableCheck
      const enableCheck =
        type === "dropdown"
          ? itemIndex !== -1 ||
            (index === 0 && localSelectedItems?.length === 0)
          : itemIndex !== -1;

      const displayName = item?.fN
        ? `${item.fN} ${item.lN || ""}`.trim()
        : item?.label || "";

      return (
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={() => itemSelected(item)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Select ${displayName}`}
          accessibilityState={{ selected: enableCheck }}
          activeOpacity={0.7}
        >
          <View style={styles.mainContainer}>
            <Avatar
              rad={SIZES.AVATAR_RADIUS}
              name={item?.emailId ? item?.fN || item?.emailId : item?.label}
              color={item?.color}
              profileIcon={item?.icon}
              textSize={normalize(14)}
              userId={item?.id}
              fromProfile={false}
            />
            <View style={styles.textContainer}>
              {displayName && (
                <Text style={styles.textStyle1} numberOfLines={1}>
                  {displayName}
                </Text>
              )}

              {item?.email && (
                <Text style={styles.emailText}>{item.email}</Text>
              )}
            </View>
          </View>
          {enableCheck && (
            <CheckMark
              width={SIZES.CHECK_ICON}
              height={SIZES.CHECK_ICON}
              color={COLORS.PRIMARY}
            />
          )}
        </TouchableOpacity>
      );
    },
    [localSelectedItems, type, itemSelected]
  );

  const keyExtractor = useCallback((item) => item?.id?.toString(), []);

  // Handle empty state
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No items available</Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select</Text>
      <View style={styles.divider} />

      <FlatList
        data={recentSelectedItem}
        keyExtractor={keyExtractor}
        renderItem={renderOptionItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          recentSelectedItem.length === 0 && styles.emptyListContainer
        }
      />

      {type === "multiselect" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancelPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancel selection"
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity
            onPress={donePress}
            disabled={!hasChanges}
            style={hasChanges ? styles.doneButton : styles.doneButtonDisabled}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Confirm selection"
            accessibilityState={{ disabled: !hasChanges }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.doneButtonText,
                { color: hasChanges ? COLORS.WHITE : COLORS.DISABLED_TEXT },
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// Remove PropTypes since this project uses TypeScript
export default ChooseItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: normalize(16),
    color: COLORS.TEXT_PRIMARY,
    alignSelf: "center",
    fontWeight: "600",
    paddingBottom: SPACING.LARGE,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginStart: SPACING.SMALL,
  },
  textStyle1: {
    fontSize: normalize(14),
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.EXTRA_LARGE,
    marginTop: SPACING.MEDIUM,
    marginBottom: SPACING.BOTTOM,
  },
  buttonSpacer: {
    marginEnd: SPACING.MEDIUM,
  },
  divider: {
    backgroundColor: COLORS.BORDER,
    height: 1,
  },
  nameText: {
    fontSize: normalize(14),
    color: COLORS.TEXT_SECONDARY,
    marginStart: SPACING.SMALL,
    fontWeight: "500",
  },
  emailText: {
    fontSize: normalize(12),
    color: COLORS.TEXT_TERTIARY,
    fontWeight: "400",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.EXTRA_LARGE,
  },
  cancelButton: {
    flex: 1,
    borderColor: COLORS.BORDER,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.SMALL,
    alignItems: "center",
  },
  doneButton: {
    flex: 1,
    borderColor: COLORS.BORDER_SECONDARY,
    backgroundColor: COLORS.TEXT_PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.SMALL,
    alignItems: "center",
  },
  doneButtonDisabled: {
    flex: 1,
    borderColor: COLORS.BACKGROUND_DISABLED,
    backgroundColor: COLORS.BACKGROUND_DISABLED,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.SMALL,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: normalize(16),
    color: COLORS.TEXT_SECONDARY,
    alignSelf: "center",
    fontWeight: "500",
  },
  doneButtonText: {
    fontSize: normalize(16),
    color: COLORS.TEXT_SECONDARY,
    alignSelf: "center",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.EXTRA_LARGE,
  },
  emptyStateText: {
    fontSize: normalize(16),
    color: COLORS.TEXT_TERTIARY,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.EXTRA_LARGE,
  },
});
