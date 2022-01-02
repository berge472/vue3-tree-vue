import { IsValidDropCallback, TreeState, TreeViewItem } from "./types";
import TreeItemComponent from "./tree-item.vue";
import { useTreeViewItemMouseActions } from "../src/composables/use-tree-mouse-actions";
import { useGraph } from "./composables/use-graph";
import { computed, defineComponent, PropType, ref } from "vue";

export default defineComponent({
    name: 'tree-view',
    props: {
        items: {
            type: Array as PropType<TreeViewItem[]>,
            required: true,
            default: () => { return []}
        },
        selectedItem: {
            type: Object as PropType<TreeViewItem>,
        },
        checkedItems: {
            type: Array as PropType<TreeViewItem[]>
        },
        isCheckable: {
            type: Boolean
        },
        hideGuideLines : {
            type: Boolean,
            default: false
        },
        onDropValidator: {
            type: Function as PropType<IsValidDropCallback>,
            default: () => { () => true; }
        },
        treeState: {
            type: Object as PropType<TreeState>
        },
        expandedTypes: {
            type: Object as PropType<string[]>,
            default: () => []
        },
        expandedIds: {
            type: Object as PropType<string[]>,
            default: () => []
        }
    },
    components: { 'treeview-item': TreeItemComponent },
    emits: ['update:selectedItem', 'update:checkedItems', 'onContextMenu'],
    
    setup(props, { emit, attrs}) {
        const parent = computed<TreeViewItem>(() => attrs.parent as TreeViewItem);

        const treeState = ref<TreeState>();
        var expandedKeys = new Set<string>([...props.expandedTypes, ...props.expandedIds]);
            // Create a tree state object for only root nodes.
        treeState.value = props.treeState ?? useGraph(
                props.selectedItem,
                (selectedItem) => emit('update:selectedItem', selectedItem),
                props.checkedItems,
                (checkedItems) => emit('update:checkedItems', checkedItems),
                (id: string, type: string) => expandedKeys.has(id) || expandedKeys.has(type)
        );

        return {
            ...useTreeViewItemMouseActions(),
            parent,
            treeState
        }
    }
})