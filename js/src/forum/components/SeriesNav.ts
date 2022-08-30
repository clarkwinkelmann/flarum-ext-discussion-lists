import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import Discussion from 'flarum/common/models/Discussion';
import DiscussionList from '../models/DiscussionList';

interface SeriesNavAttrs extends ComponentAttrs {
    currentDiscussion: Discussion
    list: DiscussionList
}

export default class SeriesNav extends Component<SeriesNavAttrs> {
    view() {
        const discussions: Discussion[] = (this.attrs.list.discussions() || []).filter(discussionOrUndefined => !!discussionOrUndefined) as Discussion[];
        const currentIndex = discussions.indexOf(this.attrs.currentDiscussion);

        // This generally shouldn't happen. If the series is rendered the discussion must be in it
        if (currentIndex === -1) {
            return null;
        }

        return m('.SeriesNav', {
            className: currentIndex > 0 ? '' : 'SeriesNav--only-next',
        }, [
            currentIndex > 0 ? this.link(discussions[currentIndex - 1], 'fas fa-angle-left', 'SeriesNav--prev') : null,
            currentIndex < discussions.length - 1 ? this.link(discussions[currentIndex + 1], 'fas fa-angle-right', 'SeriesNav--next') : null,
        ]);
    }

    link(discussion: Discussion, icon: string, className: string) {
        return LinkButton.component({
            className: 'Button ' + className,
            href: app.route.discussion(discussion),
            icon,
        }, discussion.title());
    }
}
