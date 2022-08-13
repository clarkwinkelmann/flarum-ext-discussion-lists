import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import icon from 'flarum/common/helpers/icon';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import DiscussionList from '../models/DiscussionList';
import EditListModal from './EditListModal';

interface ListHeroAttrs extends ComponentAttrs {
    list: DiscussionList
}

export default class ListHero extends Component<ListHeroAttrs> {
    view() {
        const {list} = this.attrs;

        const user = list.user();

        return m('header.Hero.ListHero', m('.container', [
            list.canEdit() ? Button.component({
                className: 'Button Button--icon ListHero-Edit',
                icon: 'fas fa-pen',
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
            }) : null,
            m('h2.Hero-title', [
                list.name(),
                list.isPublic() ? null : [
                    ' ',
                    m('span.discussion-list-private', icon('fas fa-lock')),
                ],
            ]),
            user ? m('.Hero-author', [
                avatar(user),
                ' ',
                Link.component({
                    href: app.route.user(user),
                }, username(user)),
            ]) : null,
        ]));
    }
}
