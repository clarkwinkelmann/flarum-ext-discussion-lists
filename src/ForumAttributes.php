<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Api\Serializer\ForumSerializer;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer): array
    {
        $actor = $serializer->getActor();

        // Used to show controls in the UI
        return [
            'canCreatePrivateDiscussionLists' => $actor->can('createPrivate', DiscussionList::class),
            'canCreatePublicDiscussionLists' => $actor->can('createPublic', DiscussionList::class),
            'canCreateSeriesDiscussionLists' => $actor->can('createSeries', DiscussionList::class),
        ];
    }
}
