import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import ListDropdownContent from './components/ListDropdownContent';
import DropdownThatStaysOpen from './components/DropdownThatStaysOpen';

function listsSupported() {
    if (!app.session.user) {
        return false;
    }

    return app.forum.attribute('canCreatePublicDiscussionLists') || app.forum.attribute('canCreatePrivateDiscussionLists');
}

export default function () {
    // Control visible on the discussion page
    extend(DiscussionPage.prototype, 'sidebarItems', function (items) {
        if (!listsSupported()) {
            return;
        }

        items.add('lists', DropdownThatStaysOpen.component({
            buttonClassName: 'Button',
            icon: 'fas fa-list-ol',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.forum.discussion.add'),
            lazyDraw: true,
        }, m(ListDropdownContent, {
            discussion: this.discussion,
        })), 75);
    });
}
