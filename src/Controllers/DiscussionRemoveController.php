<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\Discussion\Discussion;

class DiscussionRemoveController extends AbstractDiscussionEditController
{
    protected function editDiscussion(DiscussionList $list, Discussion $discussion, array $attributes)
    {
        $list->discussions()->detach($discussion);
        $list->updateMeta()->save();
    }
}
