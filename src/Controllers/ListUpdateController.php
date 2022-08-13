<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use ClarkWinkelmann\DiscussionLists\ListValidator;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Flarum\User\User;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;

class ListUpdateController extends AbstractListEditController
{
    protected $validator;

    public function __construct(ListValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function edit(ServerRequestInterface $request, User $actor, DiscussionList $list, array $attributes)
    {
        $this->validator->assertValid($attributes);

        if (Arr::get($attributes, 'ordering') === 'manual' && $list->ordering !== 'manual' && $list->discussion_count > 50) {
            throw new ValidationException([
                'discussion_count' => resolve(Translator::class)->trans('clarkwinkelmann-discussion-lists.api.manualLimit'),
            ]);
        }

        $isPublic = Arr::get($attributes, 'isPublic');

        if (!is_null($isPublic)) {
            if ($isPublic) {
                $actor->assertCan('createPublic', DiscussionList::class);
                $list->is_public = true;
            } else {
                $actor->assertCan('createPrivate', DiscussionList::class);
                $list->is_public = false;
            }
        }

        $list->name = Arr::get($attributes, 'name');
        $list->ordering = Arr::get($attributes, 'ordering');
        $list->save();

        if ($list->wasChanged('ordering')) {
            $list->applyForcedOrdering();
        }
    }
}
