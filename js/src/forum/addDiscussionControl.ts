import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import ListDropdown from './components/ListDropdown';

function listsSupported() {
    if (!app.session.user) {
        return false;
    }

    return app.forum.attribute('canCreatePrivateDiscussionLists') ||
        app.forum.attribute('canCreatePublicDiscussionLists') ||
        app.forum.attribute('canCreateSeriesDiscussionLists');
}

export default function () {
    // Control visible on the discussion page
    extend(DiscussionPage.prototype, 'sidebarItems', function (items) {
        if (!listsSupported()) {
            return;
        }

        items.add('lists', ListDropdown.component({
            discussion: this.discussion,
        }), 75);
    });

    if ('v17development/blog/pages/BlogItem' in flarum.core.compat) {
        extend(flarum.core.compat['v17development/blog/pages/BlogItem'].prototype, 'contentItems', function (items) {
            if (!listsSupported() || !this.article) {
                return;
            }

            items.add('lists', m('.FlarumBlog-Article-Content-Lists-Button', ListDropdown.component({
                discussion: this.article,
            })), 78); // Just below the edit controls that admins can see
        });
    }
}
