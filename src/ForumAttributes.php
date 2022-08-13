<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Api\Serializer\ForumSerializer;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer)
    {
        $actor = $serializer->getActor();

        // Used to show controls in the UI
        return [
            'canCreatePublicDiscussionLists' => $actor->can('createPublic', DiscussionList::class),
            'canCreatePrivateDiscussionLists' => $actor->can('createPrivate', DiscussionList::class),
        ];
    }
}
