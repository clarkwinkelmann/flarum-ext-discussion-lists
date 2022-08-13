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
            className: 'DiscussionListsDropdown',
            buttonClassName: 'Button',
            icon: 'fas fa-list-ol',
            label: app.translator.trans('clarkwinkelmann-discussion-lists.forum.discussion.add'),
            lazyDraw: true,
        }, m(ListDropdownContent, {
            discussion: this.discussion,
        })), 75);
    });

    if ('v17development/blog/pages/BlogItem' in flarum.core.compat) {
        extend(flarum.core.compat['v17development/blog/pages/BlogItem'].prototype, 'contentItems', function (items) {
            if (!listsSupported() || !this.article) {
                return;
            }

            items.add('lists', m('.FlarumBlog-Article-Content-Lists-Button', DropdownThatStaysOpen.component({
                className: 'DiscussionListsDropdown',
                buttonClassName: 'Button',
                icon: 'fas fa-list-ol',
                label: app.translator.trans('clarkwinkelmann-discussion-lists.forum.discussion.add'),
                lazyDraw: true,
            }, m(ListDropdownContent, {
                discussion: this.article,
            }))), 78); // Just below the edit controls that admins can see
        });
    }
}
