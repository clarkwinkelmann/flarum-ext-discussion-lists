<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Discussion\Discussion;

class DiscussionAttributes
{
    public function __invoke(DiscussionSerializer $serializer, Discussion $discussion): array
    {
        if ($serializer->getActor()->hasPermission('discussion-lists.viewPublic')) {
            $lists = $discussion->discussionLists()
                ->where('is_public', true)
                ->where('user_id', $discussion->user_id)
                ->where('discussion_count', '>', 1)
                ->get();

            $discussion->setRelation('seriesDiscussionLists', $lists);
        } else {
            $discussion->setRelation('seriesDiscussionLists', []);
        }

        return [];
    }
}
