<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Search\AbstractSearcher;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ListSearcher extends AbstractSearcher
{
    protected function getQuery(User $actor): Builder
    {
        return DiscussionList::query()->whereVisibleTo($actor);
    }
}
