import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import icon from 'flarum/common/helpers/icon';
import DiscussionList from '../models/DiscussionList';
import EditListModal from './EditListModal';

interface ListHeroAttrs extends ComponentAttrs {
    list: DiscussionList
}

export default class ListHero extends Component<ListHeroAttrs> {
    view() {
        const {list} = this.attrs;

        return m('header.Hero.ListHero', m('.container', m('.containerNarrow', [
            m('h2.Hero-title', [
                list.name(),
                list.isPublic() ? null : [
                    ' ',
                    m('span.discussion-list-private', icon('fas fa-lock')),
                ],
            ]),
            list.canEdit() ? Button.component({
                onclick() {
                    app.modal.show(EditListModal, {
                        list,
                        onsave() {
                            app.discussions.refresh();
                        },
                        ondelete() {
                            m.route.set(app.route('index'));
                        },
                    });
                },
            }, 'Edit') : null,
        ])));
    }
}
