import { ResourceIcon } from "@wingconsole/design-system";
import { ExplorerItem } from "@wingconsole/server";
import { useCallback, useEffect } from "react";

import { TreeMenuItem, useTreeMenuItems } from "../ui/use-tree-menu-items.js";

import { trpc } from "./trpc.js";

const createTreeMenuItemFromExplorerTreeItem = (
  item: ExplorerItem,
): TreeMenuItem => {
  return {
    id: item.id,
    label: item.label,
    icon: item.type ? (
      <ResourceIcon
        resourceType={item.type}
        resourcePath={item.id}
        className="w-4 h-4"
      />
    ) : undefined,
    children: item.childItems?.map((item) =>
      createTreeMenuItemFromExplorerTreeItem(item),
    ),
  };
};

const hasChild = (item: TreeMenuItem, targetId?: string): boolean => {
  if (!targetId) {
    return false;
  }
  if (item.id === targetId) {
    return true;
  }

  if (item.children) {
    for (const child of item.children) {
      if (hasChild(child, targetId)) {
        return true;
      }
    }
  }

  return false;
};

export const useExplorer = () => {
  const {
    items,
    setItems,
    selectedItems,
    setSelectedItems,
    expandedItems,
    setExpandedItems,
    expand,
    expandAll,
    collapseAll,
  } = useTreeMenuItems({
    selectedItemIds: ["root"],
  });

  const tree = trpc["app.explorerTree"].useQuery();

  const setSelectedNode = trpc["app.selectNode"].useMutation();
  const selectedNode = trpc["app.selectedNode"].useQuery();

  const onSelectedItemsChange = useCallback(
    (selectedItems: string[]) => {
      setSelectedItems(selectedItems);
      setSelectedNode.mutate({
        resourcePath: selectedItems[0] ?? "",
      });
    },
    [setSelectedNode, setSelectedItems],
  );

  useEffect(() => {
    if (!tree.data) {
      return;
    }
    setItems([createTreeMenuItemFromExplorerTreeItem(tree.data)]);

    const isPresent = items?.[0]?.children?.some((item) =>
      hasChild(item, selectedNode.data),
    );
    if (!isPresent) {
      setSelectedNode.mutate({
        resourcePath: "root",
      });
    }
  }, [tree.data, setItems]);

  useEffect(() => {
    if (!selectedNode.data) {
      return;
    }
    setSelectedItems([selectedNode.data]);
  }, [selectedNode.data, setSelectedItems]);

  useEffect(() => {
    expandAll();
  }, [items, expandAll]);

  return {
    items,
    selectedItems,
    setSelectedItems: onSelectedItemsChange,
    expandedItems,
    setExpandedItems,
    expand,
    expandAll,
    collapseAll,
  };
};
