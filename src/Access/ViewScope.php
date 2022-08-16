<?php

namespace ClarkWinkelmann\DiscussionLists\Access;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ViewScope
{
    public function __invoke(User $actor, Builder $query)
    {
        if ($actor->hasPermission('discussion-lists.viewPrivate')) {
            return;
        }

        $query->where(function (Builder $builder) use ($actor) {
            $builder->where('visibility', '!=', 'private');

            if (!$actor->hasPermission('discussion-lists.viewPublic')) {
                $builder->whereRaw('1=0');
            }
        });

        $query->orWhere(function (Builder $builder) use ($actor) {
            $builder->where('visibility', '=', 'private')
                ->where('user_id', $actor->id);
        });
    }
}
