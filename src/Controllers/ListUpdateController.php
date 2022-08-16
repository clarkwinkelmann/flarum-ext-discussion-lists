<?php

namespace ClarkWinkelmann\DiscussionLists\Controllers;

use ClarkWinkelmann\DiscussionLists\DiscussionList;
use ClarkWinkelmann\DiscussionLists\ListValidator;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Flarum\User\Exception\PermissionDeniedException;
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

        $visibility = Arr::get($attributes, 'visibility');

        if (!is_null($visibility)) {
            switch ($visibility) {
                case 'series':
                    $seriesFromOwn = $actor->hasPermission('discussion-lists.createSeriesFromOwn');
                    $seriesFromAny = $actor->hasPermission('discussion-lists.createSeriesFromAny');

                    if (!$seriesFromOwn && !$seriesFromAny) {
                        throw new PermissionDeniedException();
                    }

                    // When converting to a series and not allowed to include other authors, check it doesn't contain any illegal discussion
                    if ($seriesFromOwn && !$seriesFromOwn && $list->discussions()->where('user_id', '!=', $actor->id)->exists()) {
                        throw new ValidationException([
                            'visibility' => resolve(Translator::class)->trans('clarkwinkelmann-discussion-lists.api.seriesAnyConversionNotAllowed'),
                        ]);
                    }

                    $list->visibility = 'series';
                    break;
                case 'public':
                    $actor->assertCan('createPublic', DiscussionList::class);
                    $list->visibility = 'public';
                    break;
                default:
                    $actor->assertCan('createPrivate', DiscussionList::class);
                    $list->visibility = 'private';
                    break;
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
