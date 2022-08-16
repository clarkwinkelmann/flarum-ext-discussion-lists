import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';
import Discussion from 'flarum/common/models/Discussion';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import {ApiPayloadSingle} from 'flarum/common/Store';
import EditListModal from './EditListModal';
import DiscussionList from '../models/DiscussionList';
import ListIcon from './ListIcon';

export interface ListDropdownItemAttrs extends ComponentAttrs {
    discussion: Discussion
    list: DiscussionList
    ondelete: () => void
}

export default class ListDropdownItem extends Component<ListDropdownItemAttrs> {
    loading: boolean = false

    view() {
        const {list, discussion} = this.attrs;

        const active = (list.discussions() || []).indexOf(discussion) !== -1;

        return m('li.DiscussionListsDropdownEntry', [
            Button.component({
                onclick: () => {
                    this.loading = true;

                    app.request<ApiPayloadSingle>({
                        url: app.forum.attribute('apiUrl') + '/discussion-lists/' + list.id() + '/discussions/' + discussion.id(),
                        method: active ? 'DELETE' : 'POST',
                    }).then(payload => {
                        // Will refresh the list of included discussions
                        app.store.pushPayload(payload);

                        this.loading = false;
                        m.redraw();
                    }).catch(error => {
                        this.loading = false;
                        m.redraw();

                        throw error;
                    });
                },
            }, icon(this.icon(active))),
            Link.component({
                href: app.route('discussionList', {
                    list: list.id(),
                }),
            }, [
                list.name(),
                ListIcon.component({
                    list,
                }),
            ]),
            Button.component({
                onclick: () => {
                    app.modal.show(EditListModal, {
                        list,
                        ondelete: this.attrs.ondelete,
                    });
                },
            }, icon('fas fa-pen')),
        ]);
    }

    icon(active: boolean) {
        if (this.loading) {
            return 'fas fa-spinner fa-pulse';
        }

        if (active) {
            return 'far fa-check-square';
        }

        return 'far fa-square';
    }
}
