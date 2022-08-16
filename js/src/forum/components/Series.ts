import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import LinkButton from 'flarum/common/components/LinkButton';
import Tooltip from 'flarum/common/components/Tooltip';
import Discussion from 'flarum/common/models/Discussion';
import extractText from 'flarum/common/utils/extractText';
import DiscussionList from '../models/DiscussionList';

interface SeriesAttrs extends ComponentAttrs {
    className?: string
    currentDiscussion?: Discussion
    list: DiscussionList
}

export default class Series extends Component<SeriesAttrs> {
    expand!: boolean

    oninit(vnode: any) {
        super.oninit(vnode);

        this.expand = !app.forum.attribute('collapseDiscussionListsSeries');
    }

    view() {
        const {list} = this.attrs;

        return m('nav.DiscussionListSeries', {
            className: this.attrs.className,
        }, [
            m('.DiscussionListSeriesHead', [
                app.forum.attribute('collapseDiscussionListsSeries') ? Tooltip.component({
                    text: extractText(app.translator.trans('clarkwinkelmann-discussion-lists.forum.series.expand')),
                }, Button.component({
                    className: 'Button Button--icon DiscussionListSeriesExpandButton',
                    icon: 'fas fa-chevron-' + (this.expand ? 'up' : 'down'),
                    onclick: () => {
                        this.expand = !this.expand;
                    },
                })) : null,
                m('h3', [
                    list.name(),
                    ' ',
                    m('small', app.translator.trans('clarkwinkelmann-discussion-lists.forum.series.kind')),
                ]),
            ]),
            this.expand ? [
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
                m('.DiscussionListSeriesVisit', LinkButton.component({
                    className: 'Button',
                    href: app.route('discussionList', {
                        list: list.id(),
                    }),
                }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.series.visit'))),
            ] : null,
        ]);
    }
}
