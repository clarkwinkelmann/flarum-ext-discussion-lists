import app from 'flarum/forum/app';
import {ComponentAttrs} from 'flarum/common/Component';
import Dropdown from 'flarum/common/components/Dropdown';
import Discussion from 'flarum/common/models/Discussion';
import ListDropdownContent from './ListDropdownContent';

export interface ListDropdownAttrs extends ComponentAttrs {
    discussion: Discussion
}

export default class ListDropdown extends Dropdown {
    // Dropdown is not generic so we override our attrs type here for typescript
    attrs!: ListDropdownAttrs

    static initAttrs(attrs: any) {
        super.initAttrs(attrs);

        attrs.className = 'DiscussionListsDropdown';
        attrs.buttonClassName = 'Button';
        attrs.icon = 'fas fa-list-ol';
        attrs.label = app.translator.trans('clarkwinkelmann-discussion-lists.forum.discussion.add');
        attrs.lazyDraw = true; // Not actually used because of our changes to view below
    }

    // We need to override view to change itemCount to be at least 1, otherwise the button doesn't render as block
    // Since we override it we can also remove the listItems() code which is unneeded from our changes in getMenu
    // We can also bypass lazyDraw and directly do the lazyDraw logic instead of re-implementing the choice
    view(vnode: any) {
        return m('div', {
            className: 'ButtonGroup Dropdown dropdown ' + this.attrs.className + ' itemCount1' + (this.showing ? ' open' : '')
        }, [
            this.getButton(vnode.children),
            this.showing && this.getMenu([]),
        ]);
    }

    // We need to override getMenu and cannot reuse Dropdown as-it because otherwise we get <li> wrapped in other <li>s
    getMenu(items: any) {
        return m('ul.Dropdown-menu.dropdown-menu', {
            // Prevent the dropdown from closing when clicks happen inside if it
            onclick(event: MouseEvent) {
                event.stopPropagation();
                event.redraw = false;
            },
        }, ListDropdownContent.component({
            discussion: this.attrs.discussion,
        }));
    }
}
