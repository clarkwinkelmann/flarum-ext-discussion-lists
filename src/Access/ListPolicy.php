<?php

namespace ClarkWinkelmann\DiscussionLists\Access;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class ListPolicy extends AbstractPolicy
{
    public function createPrivate(User $actor)
    {
        return $actor->hasPermission('discussion-lists.createPrivate');
    }

    public function createPublic(User $actor)
    {
        return $actor->hasPermission('discussion-lists.createPublic');
    }

    public function createSeries(User $actor)
    {
        return $actor->hasPermission('discussion-lists.createSeriesFromOwn') || $actor->hasPermission('discussion-lists.createSeriesFromAny');
    }

    public function edit(User $actor, DiscussionList $list)
    {
        if ($actor->id === $list->user_id) {
            return $this->allow();
        }

        if (!$actor->hasPermission('discussion-lists.moderate')) {
            return $this->deny();
        }

        if ($list->visibility === 'private' && !$actor->hasPermission('discussion-lists.viewPrivate')) {
            return $this->deny();
        }

        return $this->allow();
    }
}
