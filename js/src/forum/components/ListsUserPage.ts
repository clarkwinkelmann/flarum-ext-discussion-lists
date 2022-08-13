import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from 'flarum/common/components/Link';
import UserPage from 'flarum/forum/components/UserPage';
import icon from 'flarum/common/helpers/icon';
import DiscussionList from '../models/DiscussionList';

export default class ListsUserPage extends UserPage {
    lists: DiscussionList[] = []
    loading: boolean = false

    oninit(vnode: any) {
        super.oninit(vnode);

        this.loadUser(m.route.param('username'));
    }

    show(user: any) {
        super.show(user);

        this.refresh();
    }

    refresh() {
        this.loading = true;
        this.lists = [];

        m.redraw();

        app.store.find<DiscussionList[]>('discussion-lists', {
            filter: {
                user: this.user.slug(),
            },
        }).then(lists => {
            this.lists = lists;
            this.loading = false;
            m.redraw();
        }, () => {
            this.loading = false;
            m.redraw();
        });
    }

    content() {
        if (this.loading) {
            return LoadingIndicator.component();
        }

        return m('ul', this.lists.map(list => m('li', Link.component({
            href: app.route('discussionList', {
                list: list.id(),
            }),
        }, [
            list.name(),
            list.isPublic() ? null : [
                ' ',
                m('span.discussion-list-private', icon('fas fa-lock')),
            ],
            ' ',
            m('span.discussion-list-count', '(' + list.discussionCount() + ')'),
        ]))));
    }
}
