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
    visibility: string = 'private'
    ordering: string = 'manual';
    deleting: boolean = false

    oninit(vnode: any) {
        super.oninit(vnode);

        if (this.attrs.list) {
            this.name = this.attrs.list.name();
            this.visibility = this.attrs.list.visibility();
            this.ordering = this.attrs.list.ordering();
        } else if (!app.forum.attribute('canCreatePrivateDiscussionLists')) {
            if (app.forum.attribute('canCreatePublicDiscussionLists')) {
                this.visibility = 'public';
            } else {
                this.visibility = 'series';
            }
        }
    }

    className() {
        return 'EditDiscussionListModal Modal--small';
    }

    title() {
        return app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.title');
    }

    content() {
        const visibilityOptions: any = {};

        if (app.forum.attribute('canCreatePrivateDiscussionLists')) {
            visibilityOptions.private = app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.visibilityOptions.private');
        }
        if (app.forum.attribute('canCreatePublicDiscussionLists')) {
            visibilityOptions.public = app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.visibilityOptions.public');
        }
        if (app.forum.attribute('canCreateSeriesDiscussionLists')) {
            visibilityOptions.series = app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.visibilityOptions.series');
        }


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
                m('label', app.translator.trans('clarkwinkelmann-discussion-lists.forum.edit.visibility')),
                Select.component({
                    value: this.visibility,
                    onchange: (value: string) => {
                        this.visibility = value;
                    },
                    options: visibilityOptions,
                    disabled: (
                        (app.forum.attribute('canCreatePrivateDiscussionLists') ? 1 : 0) +
                        (app.forum.attribute('canCreatePublicDiscussionLists') ? 1 : 0) +
                        (app.forum.attribute('canCreateSeriesDiscussionLists') ? 1 : 0)
                    ) <= 1,
                }),
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
            visibility: this.visibility,
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
