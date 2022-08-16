<?php

namespace ClarkWinkelmann\DiscussionLists;

use Carbon\Carbon;
use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Discussion\Discussion;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $visibility
 * @property string $ordering
 * @property int $discussion_count
 * @property Carbon $created_at
 * @property Carbon $updated_at
 *
 * @property User $user
 */
class DiscussionList extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'discussion_lists';

    public $timestamps = true;

    protected $dates = [
        'created_at',
        'updated_at',
    ];

    public function user(): Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function discussions(): Relations\BelongsToMany
    {
        return $this->belongsToMany(Discussion::class, 'discussion_list', 'list_id')
            ->withTimestamps()
            ->withPivot('order');
    }

    public function sortedDiscussions(): Relations\BelongsToMany
    {
        return $this->discussions()
            ->orderByPivot('order', 'asc');
    }

    public function updateMeta(): self
    {
        $this->discussion_count = $this->discussions()->count();

        return $this;
    }

    public function applyForcedOrdering(): self
    {
        if ($this->ordering === 'manual') {
            return $this;
        }

        $query = $this->discussions();

        switch ($this->ordering) {
            case 'created:asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'created:desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'added:asc':
                $query->orderByPivot('created_at', 'asc');
                break;
            case 'added:desc':
                $query->orderByPivot('created_at', 'desc');
                break;
        }

        $number = 0;

        $query->each(function (Discussion $discussion) use (&$number) {
            $this->discussions()->updateExistingPivot($discussion, [
                'order' => ++$number,
            ]);
        });

        return $this;
    }
}
