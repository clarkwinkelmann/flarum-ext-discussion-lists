<?php

namespace ClarkWinkelmann\DiscussionLists\Gambits;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;
use Flarum\Search\AbstractRegexGambit;
use Flarum\Search\SearchState;
use Flarum\User\User;
use Illuminate\Database\Query\Builder;

class ListGambit extends AbstractRegexGambit implements FilterInterface
{
    protected function getGambitPattern(): string
    {
        return 'list:(.+)';
    }

    protected function conditions(SearchState $search, array $matches, $negate)
    {
        $this->constrain($search->getQuery(), $matches[1], $negate, $search->getActor());

        $search->setDefaultSort([
            'discussion_list.order' => 'asc',
        ]);
    }

    public function getFilterKey(): string
    {
        return 'list';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $this->constrain($filterState->getQuery(), $filterValue, $negate, $filterState->getActor());

        $filterState->setDefaultSort([
            'discussion_list.order' => 'asc',
        ]);
    }

    protected function constrain(Builder $query, $id, $negate, User $actor)
    {
        // We don't actually need this value, but this will serve as access control
        $list = DiscussionList::query()->whereVisibleTo($actor)->findOrFail($id);

        // Negative is not implemented
        $query->join('discussion_list', 'discussion_list.discussion_id', '=', 'discussions.id')
            ->where('discussion_list.list_id', '=', $id);
    }
}
