import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Tooltip from 'flarum/common/components/Tooltip';
import icon from 'flarum/common/helpers/icon';
import extractText from 'flarum/common/utils/extractText';
import DiscussionList from '../models/DiscussionList';

interface ListIconAttrs extends ComponentAttrs {
    list: DiscussionList
}

export default class ListIcon extends Component<ListIconAttrs> {
    view() {
        let iconName: string | null = null;
        let text: string | null = null;

        switch (this.attrs.list.visibility()) {
            case 'private':
                iconName = 'fas fa-lock';
                text = extractText(app.translator.trans('clarkwinkelmann-discussion-lists.forum.badge.private'));
                break;
            case 'series':
                iconName = 'fas fa-list-ol';
                text = extractText(app.translator.trans('clarkwinkelmann-discussion-lists.forum.badge.series'));
                break;
        }

        if (!iconName) {
            return null;
        }

        return [
            ' ',
            Tooltip.component({
                text,
            }, m('span.discussion-list-' + this.attrs.list.visibility(), icon(iconName))),
        ]
    }
}
