import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import LinkButton from 'flarum/common/components/LinkButton';
import UserPage from 'flarum/forum/components/UserPage';
import ListsUserPage from './components/ListsUserPage';

export default function () {
    app.routes['user.discussionLists'] = {path: '/u/:username/discussion-lists', component: ListsUserPage};

    extend(UserPage.prototype, 'navItems', function (items) {
        if (!this.user.attribute('discussionListsTabVisible')) {
            return;
        }

        items.add('discussionLists', LinkButton.component({
            href: app.route('user.discussionLists', {username: this.user.slug()}),
            name: 'mentions',
            icon: 'fas fa-list-ol',
        }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.profile.link')), 10);
    });
}
