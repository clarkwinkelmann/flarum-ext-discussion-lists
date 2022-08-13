<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Filter\AbstractFilterer;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ListFilterer extends AbstractFilterer
{
    protected function getQuery(User $actor): Builder
    {
        return DiscussionList::query()->whereVisibleTo($actor);
    }
}
