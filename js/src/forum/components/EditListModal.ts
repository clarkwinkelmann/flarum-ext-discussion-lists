import app from 'flarum/forum/app';
import Modal, {IInternalModalAttrs} from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Select from 'flarum/common/components/Select';
import Switch from 'flarum/common/components/Switch';
import extractText from 'flarum/common/utils/extractText';
import DiscussionList from '../models/DiscussionList';

interface EditListModalAttrs extends IInternalModalAttrs {
    list?: DiscussionList
    onsave?: () => void
    ondelete?: () => void
}

export default class EditListModal extends Modal<EditListModalAttrs> {
    name: string = ''
    isPublic: boolean = false
    ordering: string = 'manual';
    deleting: boolean = false

    oninit(vnode: any) {
        super.oninit(vnode);

        if (this.attrs.list) {
            this.name = this.attrs.list.name();
            this.isPublic = this.attrs.list.isPublic();
            this.ordering = this.attrs.list.ordering();
        } else if (!app.forum.attribute('canCreatePrivateDiscussionLists')) {
            this.isPublic = true;
        }
    }

    className() {
        return 'EditDiscussionListModal Modal--small';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.title');
    }

    content() {
        return m('.Modal-body', [
            m('.Form-group', [
                m('label', {
                    for: 'edit-list-modal-name',
                }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.name')),
                m('input', {
                    id: 'edit-list-modal-name',
                    type: 'text',
                    className: 'FormControl',
                    value: this.name,
                    onchange: (event: InputEvent) => {
                        this.name = (event.target as HTMLInputElement).value;
                    },
                }),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.isPublic,
                    onchange: (checked: boolean) => {
                        this.isPublic = checked;
                    },
                    disabled: app.forum.attribute('canCreatePublicDiscussionLists') !== app.forum.attribute('canCreatePrivateDiscussionLists'),
                }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.isPublic')),
            ]),
            m('.Form-group', [
                m('label', app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.ordering')),
                Select.component({
                    value: this.ordering,
                    onchange: (value: string) => {
                        this.ordering = value;
                    },
                    options: {
                        manual: app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.orderingOptions.manual'),
                        'created:asc': app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.orderingOptions.createdAsc'),
                        'created:desc': app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.orderingOptions.createdDesc'),
                        'added:asc': app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.orderingOptions.addedAsc'),
                        'added:desc': app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.orderingOptions.addedDesc'),
                    },
                }),
            ]),
            m('.Form-group', [
                Button.component({
                    type: 'submit',
                    className: 'Button Button--primary EditDiscussionListModal-save',
                    loading: this.loading,
                }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.save')),
                this.attrs.list ? Button.component({
                    type: 'button',
                    className: 'Button EditDiscussionListModal-delete',
                    onclick: () => {
                        if (!confirm(extractText(app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.deleteConfirmation')))) {
                            return;
                        }

                        this.deleting = true;

                        this.attrs.list!.delete({
                            errorHandler: this.onerror.bind(this),
                        }).then(() => {
                            this.hide();

                            if (this.attrs.ondelete) {
                                this.attrs.ondelete();
                            }
                        }, () => {
                            this.deleting = false;
                            m.redraw();
                        });
                    },
                }, app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.delete')) : null,
            ]),
        ]);
    }

    onsubmit(event: Event) {
        event.preventDefault();

        this.loading = true;

        (this.attrs.list || app.store.createRecord('discussion-lists')).save({
            name: this.name,
            isPublic: this.isPublic,
            ordering: this.ordering,
        }, {
            errorHandler: this.onerror.bind(this),
        }).then(() => {
            this.hide();

            if (this.attrs.onsave) {
                this.attrs.onsave();
            }
        }, () => {
            this.loading = false;
            m.redraw();
        });
    }
}
