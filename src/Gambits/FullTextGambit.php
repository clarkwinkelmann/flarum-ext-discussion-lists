<?php

namespace ClarkWinkelmann\DiscussionLists\Gambits;

use Flarum\Search\GambitInterface;
use Flarum\Search\SearchState;

class FullTextGambit implements GambitInterface
{
    public function apply(SearchState $search, $bit)
    {
        $search->getQuery()->where('discussion_lists.name', 'like', '%' . $bit . '%');
    }
}
