import app from 'flarum/forum/app';
import type Mithril from 'mithril';
import {extend, override} from 'flarum/common/extend';
import {ApiPayloadSingle} from 'flarum/common/Store';
import Discussion from 'flarum/common/models/Discussion';
import {ComponentAttrs} from 'flarum/common/Component';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';
import DiscussionList from 'flarum/forum/components/DiscussionList';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import Sortable from 'flamarkt/backoffice/common/components/Sortable';
import SortableHandle from 'flamarkt/backoffice/common/components/SortableHandle';
import ListHero from './components/ListHero';
import ListModel from './models/DiscussionList';

// Implementation based on Tag's addTagFilter
export default function () {
    IndexPage.prototype.currentList = function () {
        if (this.currentActiveList) {
            return this.currentActiveList;
        }

        const id = app.search.params().list;

        if (!id) {
            return null;
        }

        const list = app.store.getById('discussion-lists', id);

        if (list) {
            this.currentActiveList = list;
            return this.currentActiveList;
        }

        if (this.currentListLoading) {
            return null;
        }

        this.currentListLoading = true;

        app.store
            .find('discussion-lists', id)
            .then(list => {
                this.currentActiveList = list;

                m.redraw();
            })
            .finally(() => {
                this.currentListLoading = false;
            });

        return null;
    };

    override(IndexPage.prototype, 'hero', function (original) {
        const list = this.currentList();

        if (!list) {
            return original();
        }

        return m(ListHero, {
            list,
        });
    });

    extend(IndexPage.prototype, 'view', function (vdom: Mithril.Vnode<ComponentAttrs, {}>) {
        const list = this.currentList();

        if (!list) {
            return;
        }

        (vdom.attrs as any).className += ' IndexPage--list' + list.id();
    });

    extend(IndexPage.prototype, 'setTitle', function () {
        const list = this.currentList();

        if (list) {
            app.setTitle(list.name());
        }
    });

    extend(GlobalSearchState.prototype, 'params', function (params) {
        params.list = m.route.param('list');
    });

    extend(DiscussionListState.prototype, 'requestParams', function (this: DiscussionListState, params) {
        if (this.params.list) {
            const filter = params.filter ?? {};
            filter.list = this.params.list;
            const q = filter.q;
            if (q) {
                filter.q = `${q} list:${this.params.list}`;
            }
            params.filter = filter;

            // Push page limit to the maximum to allow for manual sorting
            const page = params.page ?? {};
            page.limit = 50;
            params.page = page;
        }
    });

    override(DiscussionListState.prototype, 'sortMap', function (this: DiscussionListState, original) {
        const originalMap = original();

        if (!this.params.list) {
            return originalMap;
        }

        const newList: any = {
            discussionListDefault: '',
        };

        Object.keys(originalMap).forEach(key => {
            if (originalMap[key]) {
                newList[key] = originalMap[key];
            }
        });

        return newList;
    });

    override(DiscussionList.prototype, 'view', function (this: any, original) {
        const vdom = original() as any;

        const state = this.attrs.state as DiscussionListState;

        // If not on the lists page, change nothing
        if (!state.getParams().list) {
            return vdom;
        }

        const list = app.store.getById<ListModel>('discussion-lists', state.getParams().list);

        if (!list || list.ordering() !== 'manual' || !list.canEdit()) {
            return vdom;
        }

        // If the vdom doesn't look like a fully rendered feed, keep is like original
        if (!vdom.children.length || !vdom.children[0] && !vdom.children[0].attrs && vdom.children[0].attrs.role !== 'feed') {
            return vdom;
        }

        const sortableChildren: any = [];

        // We need to flatten the children for use in Sortable
        vdom.children[0].children.forEach(child => {
            if (!child) {
                return;
            }

            if (child.tag === '[') {
                sortableChildren.push(...child.children);
            } else {
                sortableChildren.push(child);
            }
        });

        return m('div', {
            className: vdom.attrs.className,
        }, {
            // Manually build the component for Sortable in the vdom
            // So we can apply the existing children
            tag: Sortable,
            attrs: {
                containerTag: 'ul[role=feed][aria-busy=false].' + (vdom.children[0].attrs.className).replace(' ', '.'),
                placeholderTag: 'li.DiscussionListSortablePlaceholder',
                onsort(origin: number, destination: number) {
                    const allVisibleDiscussions: Discussion[] = ([] as Discussion[]).concat(...state.getPages().map(page => {
                        return page.items;
                    }));

                    const discussion = allVisibleDiscussions[origin];

                    if (discussion && list) {
                        app.request<ApiPayloadSingle>({
                            url: app.forum.attribute('apiUrl') + '/discussion-lists/' + list.id() + '/discussions/' + discussion.id(),
                            method: 'POST',
                            body: {
                                data: {
                                    attributes: {
                                        order: destination + 1, // 0-based to 1-based
                                    },
                                },
                            },
                        }).then(payload => {
                            // Might not be necessary but we might as well do it in case you navigate back to a page that shows a summary with the discussion relationship
                            app.store.pushPayload(payload);

                            // This is a bit excessive to refresh the full list here but this is the easiest implementation
                            app.discussions.refresh();
                        });
                    }
                },
            },
            children: sortableChildren,
        });
    });

    extend(DiscussionListItem.prototype, 'view', function (vdom) {
        if (!this.attrs.params.list) {
            return;
        }

        const list = app.store.getById<ListModel>('discussion-lists', this.attrs.params.list);

        if (!list || list.ordering() !== 'manual' || !list.canEdit()) {
            return vdom;
        }

        vdom.children.forEach(child => {
            if (child && child.attrs && child.attrs.className.indexOf('DiscussionListItem-content') !== -1) {
                child.children.unshift(m(SortableHandle, {
                    className: 'DiscussionListSortableHandle',
                }));
            }
        });
    });
}
