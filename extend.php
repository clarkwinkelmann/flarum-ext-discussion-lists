<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Api\Controller\ShowDiscussionController;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\Filter\DiscussionFilterer;
use Flarum\Discussion\Search\DiscussionSearcher;
use Flarum\Extend;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less')
        ->route('/discussion-lists/{list}', 'discussion-lists.show', Content\DiscussionListContent::class),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\Routes('api'))
        ->get('/discussion-lists', 'discussion-lists.index', Controllers\ListIndexController::class)
        ->post('/discussion-lists', 'discussion-lists.store', Controllers\ListCreateController::class)
        ->patch('/discussion-lists/{id}', 'discussion-lists.update', Controllers\ListUpdateController::class)
        ->delete('/discussion-lists/{id}', 'discussion-lists.destroy', Controllers\ListDeleteController::class)
        ->get('/discussion-lists/{id}', 'discussion-lists.show', Controllers\ListShowController::class)
        ->post('/discussion-lists/{id}/discussions/{discussionId}', 'discussion-lists.discussion.add', Controllers\DiscussionAddController::class)
        ->delete('/discussion-lists/{id}/discussions/{discussionId}', 'discussion-lists.discussion.remove', Controllers\DiscussionRemoveController::class),

    (new Extend\Settings())
        ->serializeToForum('collapseDiscussionListsSeries', 'discussion-lists.collapseSeries', 'boolval'),

    (new Extend\Model(Discussion::class))
        ->relationship('discussionLists', function (Discussion $discussion) {
            return $discussion->belongsToMany(DiscussionList::class, 'discussion_list', 'discussion_id', 'list_id');
        })
        ->relationship('seriesDiscussionLists', function (Discussion $discussion) {
            return $discussion->belongsToMany(DiscussionList::class, 'discussion_list', 'discussion_id', 'list_id')
                ->where('visibility', 'series')
                ->where('discussion_count', '>', 1);
        }),

    (new Extend\ModelVisibility(DiscussionList::class))
        ->scope(Access\ViewScope::class),

    (new Extend\Policy())
        ->modelPolicy(DiscussionList::class, Access\ListPolicy::class),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->hasMany('seriesDiscussionLists', ListSerializer::class),

    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(UserAttributes::class),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(ForumAttributes::class),

    (new Extend\ApiController(ShowDiscussionController::class))
        ->addInclude('seriesDiscussionLists.discussions'),

    (new Extend\SimpleFlarumSearch(ListSearcher::class))
        ->setFullTextGambit(Gambits\FullTextGambit::class)
        ->addGambit(Gambits\UserGambit::class),
    (new Extend\Filter(ListFilterer::class))
        ->addFilter(Gambits\UserGambit::class),

    (new Extend\SimpleFlarumSearch(DiscussionSearcher::class))
        ->addGambit(Gambits\ListGambit::class),
    (new Extend\Filter(DiscussionFilterer::class))
        ->addFilter(Gambits\ListGambit::class),
];
