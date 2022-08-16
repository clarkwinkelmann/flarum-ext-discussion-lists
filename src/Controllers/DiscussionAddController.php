<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use Flarum\Discussion\Discussion;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Illuminate\Support\Arr;

class DiscussionAddController extends AbstractDiscussionEditController
{
    protected function editDiscussion(DiscussionList $list, Discussion $discussion, array $attributes)
    {
        if ($list->visibility === 'series' && $discussion->user_id !== $list->user_id && !$list->user->hasPermission('discussion-lists.createSeriesFromAny')) {
            throw new ValidationException([
                'discussion_count' => resolve(Translator::class)->trans('clarkwinkelmann-discussion-lists.api.seriesAnyAddNotAllowed'),
            ]);
        }

        $updateMeta = true;

        if ($list->ordering === 'manual') {
            if ($list->discussions()->where('id', $discussion->id)->exists()) {
                $updateMeta = false;

                $manualNumber = max(Arr::get($attributes, 'order'), 1);

                $number = 1;

                // Re-order every entry and add 1 to each number after the target
                // Remove the target discussion from the list so its old position doesn't affect the new numbering
                // Since we don't re-number on delete this is an opportunity to make the number continuous again
                $list->discussions()
                    ->where('id', '!=', $discussion->id)
                    ->orderByPivot('order', 'asc')->each(function (Discussion $discussion) use ($list, $manualNumber, &$number) {
                        $list->discussions()->updateExistingPivot($discussion, [
                            'order' => $number >= $manualNumber ? $number + 1 : $number,
                        ]);

                        $number++;
                    });

                // Finally, apply the given number fo the targeted entry
                $list->discussions()->updateExistingPivot($discussion, [
                    'order' => $manualNumber,
                ]);
            } else {
                if ($list->discussion_count >= 50) {
                    throw new ValidationException([
                        'discussion_count' => resolve(Translator::class)->trans('clarkwinkelmann-discussion-lists.api.manualLimit'),
                    ]);
                }

                $number = $list->discussions()->max('order') ?: 0;

                $list->discussions()->attach($discussion, [
                    'order' => $number + 1,
                ]);
            }
        } else {
            $list->discussions()->attach($discussion);
            $list->applyForcedOrdering();
        }

        if ($updateMeta) {
            $list->updateMeta()->save();
        }
    }
}
