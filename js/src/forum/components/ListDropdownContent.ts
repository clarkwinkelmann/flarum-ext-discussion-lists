import app from 'flarum/forum/app';
import Component, {ComponentAttrs} from 'flarum/common/Component';
import Discussion from 'flarum/common/models/Discussion';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import ListDropdownItem from './ListDropdownItem';
import DiscussionList from '../models/DiscussionList';
import EditListModal from './EditListModal';

export interface ListDropdownContentAttrs extends ComponentAttrs {
    discussion: Discussion
}

export default class ListDropdownContent extends Component<ListDropdownContentAttrs> {
    lists!: DiscussionList[]
    loading: boolean = true

    oninit(vnode: any) {
        super.oninit(vnode);

        this.refresh();
    }

    refresh() {
        this.loading = true;

        app.store.find<DiscussionList[]>('discussion-lists', {
            filter: {
                user: app.session.user!.slug(),
            },
        }).then(lists => {
            this.lists = lists;
            this.loading = false;
            m.redraw();
        });
    }

    view() {
        if (this.loading) {
            return [
                LoadingIndicator.component(),
            ];
        }

        return [
            ...this.lists.map(list => m(ListDropdownItem, {
                discussion: this.attrs.discussion,
                list,
                ondelete: () => {
                    this.refresh();
                },
            })),
            Button.component({
                onclick: () => {
                    app.modal.show(EditListModal, {
                        onsave: () => {
                            this.refresh();
                        },
                    });
                },
                icon: 'fas fa-plus',
            }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.discussion.new')),
        ];
    }
}
