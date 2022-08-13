import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import Discussion from 'flarum/common/models/Discussion';
import DiscussionList from '../models/DiscussionList';

interface SeriesAttrs extends ComponentAttrs {
    className?: string
    currentDiscussion?: Discussion
    list: DiscussionList
}

export default class Series extends Component<SeriesAttrs> {
    view() {
        const {list} = this.attrs;

        return m('nav.DiscussionListSeries', {
            className: this.attrs.className,
        }, [
            list.canEdit() ? LinkButton.component({
                className: 'Button Button--icon DiscussionListSeries-Edit',
                icon: 'fas fa-pen',
                href: app.route('discussionList', {
                    list: list.id(),
                }),
            }) : null,
            m('h3', list.name()),
            m('ol', (list.discussions() || []).map(discussion => {
                // Shouldn't happen, but Typescript
                if (!discussion) {
                    return null;
                }

                if (discussion === this.attrs.currentDiscussion) {
                    return m('li.active', discussion.title());
                }

                return m('li', Link.component({
                    href: app.route.discussion(discussion),
                }, discussion.title()))
            })),
        ]);
    }
}
