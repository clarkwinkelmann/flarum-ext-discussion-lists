<?php

namespace ClarkWinkelmann\DiscussionLists;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;

class ListSerializer extends AbstractSerializer
{
    protected $type = 'discussion-lists';

    /**
     * @param DiscussionList $list
     * @return array
     */
    protected function getDefaultAttributes($list): array
    {
        return [
            'name' => $list->name,
            'isPublic' => (boolean)$list->is_public,
            'ordering' => $list->ordering,
            'discussionCount' => $list->discussion_count,
            'createdAt' => $this->formatDate($list->created_at),
            'canEdit' => $this->actor->can('edit', $list),
        ];
    }

    public function user($list)
    {
        return $this->hasOne($list, BasicUserSerializer::class);
    }

    public function discussions($list)
    {
        return $this->hasMany($list, BasicDiscussionSerializer::class, 'sortedDiscussions');
    }
}
