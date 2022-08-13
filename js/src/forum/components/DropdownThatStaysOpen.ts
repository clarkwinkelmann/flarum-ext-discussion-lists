import Dropdown from 'flarum/common/components/Dropdown';

export default class DropdownThatStaysOpen extends Dropdown {
    getMenu(items: any) {
        const vdom = super.getMenu(items);

        // Prevent the dropdown from closing when clicks happen inside if it
        (vdom.attrs as any).onclick = function (event: MouseEvent) {
            event.stopPropagation();

            event.redraw = false;
        };

        return vdom;
    }
}
