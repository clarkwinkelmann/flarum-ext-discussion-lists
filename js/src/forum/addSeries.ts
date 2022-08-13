import {extend} from 'flarum/common/extend';
import Model from 'flarum/common/Model';
import Discussion from 'flarum/common/models/Discussion';
import DiscussionHero from 'flarum/forum/components/DiscussionHero';
import ItemList from 'flarum/common/utils/ItemList';
import DiscussionList from './models/DiscussionList';
import Series from './components/Series';

export default function () {
    Discussion.prototype.seriesDiscussionLists = Model.hasMany('seriesDiscussionLists');

    extend(DiscussionHero.prototype, 'items', function (this: any, items) {
        (this.attrs.discussion.seriesDiscussionLists() || []).forEach((list: DiscussionList) => {
            items.add('discussion-lists-series' + list.id(), Series.component({
                list,
                currentDiscussion: this.attrs.discussion,
            }));
        });
    });

    if ('v17development/blog/components/BlogItemSidebar' in flarum.core.compat) {
        extend(flarum.core.compat['v17development/blog/components/BlogItemSidebar'].prototype, 'items', function (items: ItemList<any>) {
            // All items have the same priority in the original extension, so we'll move author even more to the top so we can squeeze below it
            items.setPriority('author', 50);

            const {article} = this.attrs;

            if (!article) {
                return;
            }

            (article.seriesDiscussionLists() || []).forEach((list: DiscussionList) => {
                items.add('discussion-lists-series' + list.id(), Series.component({
                    className: 'BlogSideWidget',
                    list,
                    currentDiscussion: article,
                }), 40);
            });
        });
    }
}
