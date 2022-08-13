<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class UserAttributes
{
    public function __invoke(UserSerializer $serializer, User $user): array
    {
        $profileTabVisible = false;

        if ($user->can('createPublic', DiscussionList::class)) {
            $profileTabVisible = true;
        } else {
            $actor = $serializer->getActor();

            if ($actor->id === $user->id || $actor->hasPermission('discussion-lists.viewPrivate')) {
                $profileTabVisible = $user->can('createPrivate', DiscussionList::class);
            }
        }

        return [
            'discussionListsTabVisible' => $profileTabVisible,
        ];
    }
}
